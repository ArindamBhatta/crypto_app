import 'package:flutter/material.dart';
import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:url_launcher/url_launcher_string.dart';

bool get isWeb => identical(0, 0.0);

class AuthService {
  final FlutterAppAuth _appAuth = FlutterAppAuth();
  final _storage = FlutterSecureStorage();

  final String clientId = "MY_CLIENT_ID";
  final String redirectUri = "MY_REDIRECT_URI";

  final String authorizationEndpoint = "https://app.neynar.com/oauth/authorize";

  final String tokenEndpoint = "https://app.neynar.com/oauth/token";

  Future<bool> signIn() async {
    try {
      final authorizationUrl =
          '$authorizationEndpoint?'
          'response_type=code&'
          'client_id=$clientId&'
          'redirect_uri=${Uri.encodeComponent(redirectUri)}&'
          'scope=read,write';

      if (isWeb) {
        // For web, use url_launcher to open the authorization URL
        if (await canLaunchUrlString(authorizationUrl)) {
          final launched = await launchUrlString(
            authorizationUrl,
            mode: LaunchMode.externalApplication,
          );
          return launched; // Returns true if URL was launched successfully
        }
        throw Exception('Could not launch $authorizationUrl');
      }

      // For mobile, use the AppAuth flow
      final result = await _appAuth.authorizeAndExchangeCode(
        AuthorizationTokenRequest(
          clientId,
          redirectUri,
          serviceConfiguration: AuthorizationServiceConfiguration(
            authorizationEndpoint: authorizationEndpoint,
            tokenEndpoint: tokenEndpoint,
          ),
          scopes: ['read', 'write'],
        ),
      );

      // If we get here, the auth was successful
      await _storage.write(key: 'access_token', value: result.accessToken!);
      if (result.refreshToken != null) {
        await _storage.write(key: 'refresh_token', value: result.refreshToken!);

        debugPrint(result.refreshToken);
      }
      return true;
    } catch (e) {
      debugPrint("ERROR SIGNING IN: $e");
      return false;
    }
  }
}
