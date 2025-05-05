# terraform/versions.tf

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # State管理設定 (CI/CDと連携する場合はS3バックエンドを使う？)
  # backend "s3" {
  #   bucket = "your-remote-state-bucket-for-root-module" # <-- !! State保存用S3バケット名に変更 !!
  #   key    = "my-aws-infrastructure/terraform.tfstate"   # <-- !! Stateファイルへのパスに変更 !!
  #   region = "ap-northeast-1"                           # <-- !! Stateバケットのリージョンに変更 !!
  #   encrypt = true                                     # Stateファイルを暗号化 (推奨)
  #   dynamodb_table = "your-state-lock-table-name"      # <-- !! Stateロック用DynamoDBテーブル名に変更 !!
  # }
}

# プロバイダ設定
provider "aws" {
  region = "ap-northeast-1" # 東京リージョンのみに限定
  # 必要に応じてプロファイルや認証情報の設定を追加
  # profile = "your-aws-profile-name"
}
