class Environment {
  static const String anonKey = String.fromEnvironment('anonKey',
      defaultValue:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwb2hhcXZ6Zmd2ZGloeGN3dmZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkyMzM0OTgsImV4cCI6MjAwNDgwOTQ5OH0.vOlkfj8sLoDvmWV3rrbNWwpu0Iir0Z5V5P4MuUpI5oI");
  static const String supabaseClientURL = String.fromEnvironment(
      'supabaseClientURL',
      defaultValue: "https://spohaqvzfgvdihxcwvff.supabase.co");
  static const int numberOfInstructionImagesToDownload = int.fromEnvironment(
      'numberOfInstructionImagesToDownload',
      defaultValue: 10);
  static const int numberOfStepContentTypesToDownload = int.fromEnvironment(
      'numberOfStepContentTypesToDownload',
      defaultValue: 60);
}
