# AWS Infrastructure with Terraform Modules

このプロジェクトは、Terraformを使用してAWSリソースをデプロイするためのサンプルコードです。再利用可能なTerraformモジュールとして実装されており、東京リージョン (`ap-northeast-1`) にリソースを作成することを想定しています。

## プロジェクト構成

プロジェクトは以下のディレクトリ構成になっています。

```
my-aws-infrastructure/
├── modules/
│   ├── iam-role-module/  # IAM Role作成モジュール
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── s3-module/        # S3バケット作成モジュール
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
├── main.tf             # ルートモジュール: モジュールを呼び出し、リソースを構成します
├── variables.tf        # ルートモジュール: ルートモジュールの入力変数 (必要に応じて使用)
├── outputs.tf          # ルートモジュール: デプロイ後に確認したい出力値を定義します
└── versions.tf         # ルートモジュール: Terraformとプロバイダのバージョン、バックエンド設定
└── README.md           # このファイル
```

-   `modules/`: 再利用可能なモジュール群を格納します。
    -   `iam-role-module/`: IAMロールを作成します。
    -   `s3-module/`: S3バケットとPublic Access Blockを作成します。
-   ルートモジュール (`terraform/` 直下のファイル): プロジェクト全体の構成を定義し、各モジュールを呼び出します。

## 事前準備 (Prerequisites)

このプロジェクトを使用するには、以下のツールが必要です。

-   [Terraform](https://developer.hashicorp.com/terraform/downloads) (バージョン 1.0 以上推奨)
-   [AWS CLI](https://aws.amazon.com/jp/cli/)
-   AWS アカウント
-   Git
-   (コードをGitHubで管理する場合) GitHubアカウント、Personal Access Token (PAT) などプッシュのための認証設定

### AWS認証情報の設定

TerraformがAWSリソースを作成するためには、AWS認証情報が必要です。以下のいずれかの方法で設定してください。（推奨はIAMロールやAWS CLIの設定ファイル (`~/.aws/credentials`) です。）

-   `aws configure` コマンドを使用して設定ファイルに保存する。
-   環境変数 `AWS_ACCESS_KEY_ID` および `AWS_SECRET_ACCESS_KEY` に設定する。

**注意:** GitHub Actionsから実行する場合は、これらの認証情報をGitHub Secretsに登録する必要があります。

## 使用方法

1.  このリポジトリをクローンします。

    ```bash
    git clone https://github.com/shunsukehata/terraform.git
    cd terraform # プロジェクトのルートディレクトリに移動
    ```

2.  Terraformプロジェクトを初期化します。必要なプロバイダとモジュールがダウンロードされます。

    ```bash
    terraform init
    ```

3.  **設定の確認・編集:**
    `main.tf` ファイルを開き、モジュール呼び出し部分の変数 (`s3_bucket_name`, `iam_role_name` など) が意図した値になっているか確認、必要であれば編集してください。
    特に `s3_bucket_name` は**AWS全体でグローバルにユニークである必要がある**ため、必ず他の誰も使っていない名前に変更してください。

4.  Terraformの実行計画を確認します。これにより、どのようなリソースが作成、変更、削除されるかを確認できます。

    ```bash
    terraform plan
    ```

    **警告:** ローカル環境で `terraform apply` を実行する際は注意が必要です。Stateの不整合や競合を防ぐため、可能であればCI/CDパイプラインから実行します。

5.  実行計画を適用し、AWSリソースをデプロイします。

    ```bash
    terraform apply
    ```

    確認を求められたら `yes` と入力してください。（`-auto-approve` オプションを使用すると確認なしに実行できますが、注意して使用してください。CI/CDでは `-auto-approve` を使うことが多いです。）

6.  デプロイが完了すると、`outputs.tf` で定義された出力値が表示されます。

## 設定 (Configuration)

-   **リージョン:** リソースはすべて東京リージョン (`ap-northeast-1`) に作成されます。この設定は `versions.tf` および `main.tf` 内のプロバイダ設定で固定されています。モジュール側もデフォルトが東京リージョンになっています。
-   **変数:** 作成するIAMロール名、S3バケット名などは、ルートモジュールの `main.tf` でモジュールを呼び出す際に変数として渡しています。
-   **IAM Role Assume Role Policy:** `iam-role-module` で作成されるロールの `assume_role_policy` は、デフォルトではEC2サービスからの引き受けを許可する設定になっています。**実際の用途に合わせて、Lambda、ECS、別のアカウントなど、ロールを引き受けるエンティティに合わせて `main.tf` で呼び出し時に渡す値を変更してください。**
-   **IAM ポリシー:** このコードにはIAMロールやユーザーに特定のAWSリソースへのアクセス権限を付与するポリシー定義は含まれていません。別途 `aws_iam_policy` リソースなどを定義し、作成したロールやユーザーにアタッチする必要があります。

## 出力値の確認 (Outputs)

デプロイ完了後、あるいは後からいつでも、以下のコマンドで定義された出力値を確認できます。

```bash
terraform output