# terraform/main.tf

# IAM Role モジュールを呼び出す
module "application_role" {
  source = "./modules/iam-role-module" # モジュールディレクトリへの相対パスを指定

  role_name = "my-application-role-tokyo" # 作成したいロールの名前

  # このロールを誰（またはどのサービス）が引き受けられるかを定義します。
  # 例: Lambda関数が引き受ける場合
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com" # <-- ロールを引き受けるサービスに応じて変更 (例: ec2.amazonaws.com)
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  # モジュール側の aws_region 変数に明示的に東京リージョンを渡す (デフォルトと同じでも明示すると分かりやすい)
  aws_region = "ap-northeast-1"

  # 必要に応じて、モジュール側で定義した他の変数も指定
  # managed_policy_arns = ["arn:aws:iam::aws:policy/ReadOnlyAccess"]
}

# S3 バケット モジュールを呼び出す
module "application_data_bucket" {
  source = "./modules/s3-module" # モジュールディレクトリへの相対パスを指定

  bucket_name = "my-app-data-bucket-tokyo-unique-7890ab" # <-- !! グローバルにユニークな名前に変更 !!

  # モジュール側の aws_region 変数に明示的に東京リージョンを渡す
  aws_region = "ap-northeast-1"

  # 必要に応じて、モジュール側で定義した他の変数も指定
  # versioning_enabled = true
  # acl = "private"
}

# 注: IAM Userは独立したモジュールとしては今回作成していません。
# もし必要であれば、別途 iam-user-module を作成するか、
# このルートモジュールに直接定義を追加してください。
# resource "aws_iam_user" "app_user" {
#   name = "my-application-user"
#   tags = { ManagedBy = "TerraformRoot" }
# }