# modules/iam-role-module/outputs.tf

output "role_name" {
  description = "Name of the IAM role created."
  value       = aws_iam_role.this.name
}

output "role_arn" {
  description = "ARN of the IAM role created."
  value       = aws_iam_role.this.arn
}

# 必要に応じて、作成されたロールの他の属性も出力
# output "role_unique_id" {
#   description = "作成されたIAMロールのユニークID。"
#   value       = aws_iam_role.this.unique_id
# }
