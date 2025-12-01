import 'package:crypto_app/service/auth_service.dart';
import 'package:flutter/material.dart';

class LoginPage extends StatelessWidget {
  final AuthService authService;
  const LoginPage({super.key, required this.authService});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: ElevatedButton(
          onPressed: () async {
            bool success = await authService.signIn();
            if (success) {
              //Navigate to home page
            }
          },
          child: Text("Sign in with Farcaster"),
        ),
      ),
    );
  }
}
