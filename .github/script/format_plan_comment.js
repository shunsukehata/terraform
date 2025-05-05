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
      const actions = change.change.actions;
      const address = change.address;
      const type = change.type;
      const name = change.name;

      // リソースのヘッダー行を生成
      let headerPrefix = '';
      let headerSuffix = '';

      if (actions.includes('create')) {
        headerPrefix = '✨'; // 絵文字で作成を示す
        headerSuffix = ' (create)';
      } else if (actions.includes('delete')) {
        headerPrefix = '🗑️'; // 絵文字で削除を示す
        headerSuffix = ' (delete)';
      } else if (actions.includes('update')) {
        headerPrefix = '🔄'; // 絵文字で変更を示す
        headerSuffix = ' (update)';
      } else if (actions.includes('replace')) {
        headerPrefix = '♻️'; // 絵文字で置換を示す
        headerSuffix = ' (replace)';
      } else {
        headerPrefix = '❓'; // 未知のアクション
        headerSuffix = ` (${actions.join(',')})`;
      }

      diffOutput += `#### ${headerPrefix} \`${type}.${name}\` (${address})${headerSuffix}\n\n`;

      // 属性レベルの変更を表示
      const before = change.change.before;
      const after = change.change.after;
      const actionsDetail = change.change.actions;

      if (actionsDetail.includes('create') || actionsDetail.includes('delete')) {
        // 作成または削除の場合は、afterまたはbeforeの内容をそのまま表示
        const content = actionsDetail.includes('create') ? after : before;
        if (content) {
           diffOutput += '```hcl\n'; // hclコードブロックで表示
           // JSONオブジェクトを整形して表示
           diffOutput += JSON.stringify(content, null, 2);
           diffOutput += '\n```\n\n';
        }
      } else if (actionsDetail.includes('update') || actionsDetail.includes('replace')) {
          // 更新または置換の場合は、属性ごとの差分を表示
          // 属性レベルの詳細な差分比較は複雑なため、ここでは簡略化し、
          // 変更前後の値をリスト形式で表示します。
          // より高度な差分表示には、before/afterオブジェクトを再帰的に比較するロジックが必要です。

          diffOutput += '```diff\n'; // diffコードブロックで表示

          const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);

          keys.forEach(key => {
              const beforeValue = before ? before[key] : undefined;
              const afterValue = after ? after[key] : undefined;

              // 変更があった属性のみを表示
              if (JSON.stringify(beforeValue) !== JSON.stringify(afterValue)) {
                  // 削除された属性
                  if (beforeValue !== undefined && afterValue === undefined) {
                      diffOutput += `- ${key}: ${JSON.stringify(beforeValue)}\n`;
                  }
                  // 追加された属性
                  else if (beforeValue === undefined && afterValue !== undefined) {
                       diffOutput += `+ ${key}: ${JSON.stringify(afterValue)}\n`;
                  }
                  // 変更された属性
                  else {
                       diffOutput += `- ${key}: ${JSON.stringify(beforeValue)}\n`;
                       diffOutput += `+ ${key}: ${JSON.stringify(afterValue)}\n`;
                  }
              } else {
                 // 変更がない属性も表示したい場合はコメントアウトを外す
                 // diffOutput += `  ${key}: ${JSON.stringify(beforeValue)}\n`;
              }
          });

          diffOutput += '\n```\n\n';
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

${diffOutput} # 整形されたMarkdownをそのまま埋め込み

</details>

_Ran on commit \`${context.sha}\`_
`);
