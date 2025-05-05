# modules/s3-module/outputs.tf

output "bucket_id" {
  description = "ID (name) of the S3 bucket created."
  value       = aws_s3_bucket.this.id
}

output "bucket_arn" {
  description = "ARN of the S3 bucket created."
  value       = aws_s3_bucket.this.arn
}

# 必要に応じて、作成されたバケットの他の属性も出力
# output "bucket_regional_domain_name" {
#   description = "The regional domain name of the S3 bucket."
#   value       = aws_s3_bucket.this.bucket_regional_domain_name
# }
