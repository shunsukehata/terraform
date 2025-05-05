# modules/s3-module/main.tf
# S3 Bucketの作成
resource "aws_s3_bucket" "this" {
  bucket = var.bucket_name

  tags = {
    Name        = var.bucket_name
    ManagedBy = "TerraformModule"
  }
}

# S3バケットのPublic Accessをブロックする設定
resource "aws_s3_bucket_public_access_block" "this" {
  bucket = aws_s3_bucket.this.id

  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
  restrict_public_buckets = true
}
