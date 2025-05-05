# terraform/outputs.tf

# 呼び出したモジュールからの出力をルートモジュールから出力
output "app_bucket_name" {
  description = "Name of the application bucket created."
  value       = module.application_data_bucket.bucket_id
}

output "app_bucket_arn" {
  description = "ARN of the application bucket created."
  value       = module.application_data_bucket.bucket_arn
}
