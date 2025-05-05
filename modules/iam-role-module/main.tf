# modules/iam-role-module/main.tf
# IAM Roleの作成
resource "aws_iam_role" "this" {
  name               = var.role_name
  assume_role_policy = var.assume_role_policy # 変数で受け取ったAssume Role Policyを設定

  tags = {
    ManagedBy = "TerraformModule"
  }
}

# 必要に応じて、変数で受け取ったポリシーARNをロールにアタッチする
# resource "aws_iam_role_policy_attachment" "this" {
#   count      = length(var.managed_policy_arns)
#   role       = aws_iam_role.this.name
#   policy_arn = var.managed_policy_arns[count.index]
# }
