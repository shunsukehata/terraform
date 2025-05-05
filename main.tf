# AWSプロバイダを設定
provider "aws" {
  # ローカル実行時は~/.aws/configまたは~/.aws/credentialsからリージョンを読み込みます。
  # GitHub Actionsでは後述の設定で明示的に指定します。
  # region = "ap-northeast-1" # 必要に応じて uncomment し、任意のリージョンを指定
}

# S3バケットリソースを定義
resource "aws_s3_bucket" "my_bucket" {
  # バケット名はグローバルでユニークである必要があります。
  # 一意性を確保するために、ランダムな文字列やアカウントIDなどを含めるのが良いでしょう。
  bucket = "terraform-bucket-2025-5-5"
  tags = {
    Name        = "My Terraform Bucket"
    Environment = "Dev"
  }
}

# S3バケットのPublic Accessをブロックする設定 (推奨セキュリティ設定)
resource "aws_s3_bucket_public_access_block" "my_bucket_block" {
  bucket = aws_s3_bucket.my_bucket.id

  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
  restrict_public_buckets = true
}
