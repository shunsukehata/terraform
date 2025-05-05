output "souvenir_app_bucket_name" {
  description = "Name of the S3 bucket for the souvenir consult app in dev."
  value       = module.application_data_bucket.bucket_id
}

output "souvenir_app_bucket_arn" {
  description = "ARN of the S3 bucket for the souvenir consult app in dev."
  value       = module.application_data_bucket.bucket_arn
}