const fs = require('fs');
// JSONファイルのパス (スクリプトが実行されるリポジトリルートからの相対パス)
const planJsonPath = './envs/dev/souvenirConsultApp/plan.json';

let diffOutput = '';

try {
  // PlanのJSONファイルを読み込み、パースします
  const planJson = JSON.parse(fs.readFileSync(planJsonPath, 'utf8'));

  // リソースの変更があるか確認します
  if (planJson.resource_changes && planJson.resource_changes.length > 0) {
    diffOutput += '### Resource Changes:\n\n';
    planJson.resource_changes.forEach(change => {
      // 変更の種類 (actions) を判定します
      const actions = change.change.actions;
      const address = change.address; // リソースの完全なアドレス (例: aws_instance.example)
      const type = change.type; // リソースのタイプ (例: aws_instance)
      const name = change.name; // リソースのローカル名 (例: example)

      // アクションタイプに応じて処理を分けます
      if (actions.includes('create')) {
        // 作成の場合: + resource "type" "name" (address) の形式
        diffOutput += `+ resource "${type}" "${name}" (${address})\n`;
      } else if (actions.includes('delete')) {
        // 削除の場合: - resource "type" "name" (address) の形式
        diffOutput += `- resource "${type}" "${name}" (${address})\n`;
      } else if (actions.includes('update')) {
        // 更新の場合: ~ resource "type" "name" (address) の形式
        // GitHubのdiffハイライトは'~'に一貫して色を付けないかもしれませんが、変更を示します
        diffOutput += `~ resource "${type}" "${name}" (${address})\n`;
        // TODO: 必要に応じて属性レベルの差分表示を追加 (より複雑なJSONパースが必要)
        // 例: if (change.change.before || change.change.after) { ... 属性の比較と表示 ... }
      } else if (actions.includes('replace')) {
        // replaceはdeleteとcreateの組み合わせとして扱い、diffの色付けを改善します
        diffOutput += `- resource "${type}" "${name}" (${address}) # replace: delete\n`; // 削除部分を示す
        diffOutput += `+ resource "${type}" "${name}" (${address}) # replace: create\n`; // 作成部分を示す
      } else {
        // その他の未知のアクション
        diffOutput += `? resource "${type}" "${name}" (${address}) - ${actions.join(',')}\n`;
      }
    });
  } else if (planJson.resource_changes && planJson.resource_changes.length === 0 && planJson.prior_state) {
      // 変更がない場合
      diffOutput += '### No changes\n\nYour infrastructure matches the configuration.';
  } else {
      // JSON構造が予期しない場合やPlanが空の場合の処理
      diffOutput += '### Could not parse plan JSON or empty plan\n\n';
      diffOutput += 'Please check the raw plan output if available.\n\n';
      // オプション: パースに失敗した場合、デバッグ用に元のJSONを含める
      // try {
      //   const rawPlanContent = fs.readFileSync(planJsonPath, 'utf8');
      //   diffOutput += '### Raw plan.json content:\n\n```json\n' + JSON.stringify(planJson, null, 2) + '\n```';
      // } catch (readError) {
      //   diffOutput += `Could not read raw plan.json: ${readError.message}\n`;
      // }
  }

} catch (error) {
  // ファイル読み込みやJSONパース中にエラーが発生した場合の処理
  diffOutput = `### Error processing plan JSON\n\nAn errorが発生しました while trying to parse the plan output.\nError: ${error.message}\n\n`;
  // オプション: エラー発生時、デバッグ用に元のplan.jsonの内容を含める
  // try {
  //   const rawPlanContent = fs.readFileSync(planJsonPath, 'utf8');
  //   diffOutput += '### Raw plan.json content:\n\n```json\n' + rawPlanContent + '\n```';
  // } catch (readError) {
  //   diffOutput += `Could not read raw plan.json: ${readError.message}\n`;
  // }
}

// actions/github-script の出力変数としてコメント本文を設定します
// これにより、actions/github-script はこの値をコメントとして投稿します
// https://github.com/actions/github-script#writing-a-comment
core.setOutput('comment_body', `
### \`terraform plan\` Result (Triggered by comment)

<details><summary>Click to expand plan</summary>

\`\`\`diff  // GitHubのdiff言語で基本的な色付けを試みます
${diffOutput}
\`\`\`

</details>

_Ran on commit \`${context.sha}\`_
`);
