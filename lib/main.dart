import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:crypto_app/firebase_options.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

Future<void> initializeFirebase() async {
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  if (kDebugMode) {
    try {
      // Configure Firestore with emulator and persistence
      // Use the Firestore emulator on localhost
      FirebaseFirestore.instance.useFirestoreEmulator('localhost', 8080);
      // Keep persistence enabled for local testing
      FirebaseFirestore.instance.settings = const Settings(
        persistenceEnabled: true,
      );

      // Configure Functions emulator (ensure port matches emulator config)
      FirebaseFunctions.instance.useFunctionsEmulator('localhost', 5002);

      debugPrint('Firebase emulators initialized successfully');
    } catch (e) {
      debugPrint('Error initializing Firebase emulators: $e');
      rethrow;
    }
  } else {
    // Production settings
    FirebaseFirestore.instance.settings = const Settings(
      persistenceEnabled: true,
    );
  }
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await initializeFirebase();
    runApp(MyApp());
  } catch (error) {
    debugPrint('Firebase initialization error: $error');
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Crypto App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: LoginPage(),
    );
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sign In')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () {
                // Implement sign-in logic here
              },
              child: const Text('Sign in with Farcaster'),
            ),
          ],
        ),
      ),
    );
  }
}
