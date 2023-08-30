enum Const {
  id("id"),
  updatedAt("updated_at"),
  updatedBy("updated_by"),
  createdAt("created_at"),
  createdBy("created_by"),
  deletedAt("deleted_at"),
  deletedBy("deleted_by"),
  realtime("realtime"),
  additionalData("additional_data"),
  userId("user_id"),
  instructionId("instruction_id"),
  stepNr("step_nr"),
  description("description"),
  image("image"),
  categoryId("category_id"),
  name("name"),
  title("title"),
  shortTitle("short_title"),
  username("username"),
  role("role"),
  message("message"),
  instructionStepId("instruction_step_id"),
  open("open"),
  language("language"),
  imagesFolderName("images"),
  instructionStepsImagesFolderName("images/instructionStepsImages"),
  instructionImagesFolderName("images/instructionImages"),
  feedbackImagesFolderName("images/feedbackImages"),
  supabaseBucketUrl(
      "https://spohaqvzfgvdihxcwvff.supabase.co/storage/v1/object/public/feedback_images/");

  const Const(this.key);
  final String key;
}
