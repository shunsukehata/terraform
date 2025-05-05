variable "role_name" {
  description = "Specify the name of the IAM role to be created."
  type        = string
}

variable "assume_role_policy" {
  description = "A policy document in JSON format that defines the entities (services, users, etc.) that will assume IAM roles."
  type        = string # 通常はjsonencode() で作成したJSON文字列
}

variable "aws_region" {
  description = "The region in which the IAM role will be created. (IAM is a global service, but as a convention, it may have a region variable.)"
  type        = string
  default     = "ap-northeast-1" # デフォルトを東京リージョン
}

# 必要に応じて、ロールにアタッチする管理ポリシーARNやインラインポリシーなどを変数化
# variable "managed_policy_arns" {
#   description = "IAMロールにアタッチするAWS管理またはカスタム管理ポリシーARNのリスト。"
#   type        = list(string)
#   default     = []
# }
