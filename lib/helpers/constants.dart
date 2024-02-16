import 'package:guider/helpers/environment.dart';

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
  type("type"),
  text("text"),
  file("file"),
  textfield("textfield"),
  assetId("asset_id"),
  title("title"),
  shortTitle("short_title"),
  username("username"),
  role("role"),
  message("message"),
  instructionStepId("instruction_step_id"),
  open("open"),
  lightmode("lightmode"),
  language("language"),
  imagesFolderName("guider/images"),
  instructionStepsImagesFolderName("guider/images/instructionStepsImages"),
  instructionImagesFolderName("guider/images/instructionImages"),
  feedbackImagesFolderName("guider/images/feedbackImages"),
  assetsImagesFolderName("guider/assets"),
  supabaseFeedbackImagesBucketUrl(
      "${Environment.supabaseClientURL}/storage/v1/object/public/feedback_images/"),
  // for the JSON stored in the QR Code
  app("app"),
  client("client"),
  host("host");

  const Const(this.key);
  final String key;
}
