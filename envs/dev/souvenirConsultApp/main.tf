#module "application_data_bucket" {
#  # モジュールディレクトリへの相対パスを指定
#  source = "../../../modules/s3-module"
#
#  bucket_name = "terraform-bucket-2025-5-5"
#
#  aws_region = "ap-northeast-1"
#
#}

module "application_role" {
  # モジュールディレクトリへの相対パスを指定
  source = "../../../modules/iam-role-module"

  role_name = "souvenir-consult-app-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  # モジュール側の変数 aws_region に明示的に東京リージョンを渡す
  aws_region = "ap-northeast-1"

}
