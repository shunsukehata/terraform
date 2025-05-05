module "application_data_bucket" {
  # モジュールディレクトリへの相対パスを指定
  source = "../../../modules/s3-module"

  bucket_name = "terraform-bucket-2025-5-5"

  aws_region = "ap-northeast-1"

}

