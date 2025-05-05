variable "bucket_name" {
  description = "Specify a globally unique name for the S3 bucket to be created."
  type        = string
}

variable "aws_region" {
  description = "Region in which the S3 bucket will be created."
  type        = string
  default     = "ap-northeast-1" # デフォルトを東京リージョンに設定
}

# 必要に応じて、バケット設定（バージョン管理、ACL、タグなど）を変数化
# variable "versioning_enabled" {
#   description = "Enable versioning on the S3 bucket."
#   type        = bool
#   default     = false
# }
# variable "acl" {
#   description = "The ACL to apply."
#   type        = string
#   default     = "private"
# }