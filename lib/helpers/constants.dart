enum Const {
  id("id"),
  updatedAt("updated_at"),
  updatedBy("updated_by"),
  createdAt("created_at"),
  createdBy("created_by"),
  deletedAt("deleted_at"),
  deletedBy("deleted_by"),
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
  language("language");

  const Const(this.key);
  final String key;
}
