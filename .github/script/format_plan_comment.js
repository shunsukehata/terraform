    const fs = require('fs');
    const planJsonPath = './envs/dev/souvenirConsultApp/plan.json'; // JSONファイルのパス (ワークフローのworking-directoryからの相対パス)

    let diffOutput = '';

    try {
      const planJson = JSON.parse(fs.readFileSync(planJsonPath, 'utf8'));

      if (planJson.resource_changes && planJson.resource_changes.length > 0) {
        diffOutput += '### Resource Changes:\n\n';
        planJson.resource_changes.forEach(change => {
          // 変更の種類を判定
          const actions = change.change.actions;
          const address = change.address;
          const type = change.type;
          const name = change.name;

          let prefix = '';
          let actionDescription = '';

          if (actions.includes('create')) {
            prefix = '+';
            actionDescription = 'create';
          } else if (actions.includes('update')) {
            prefix = '~';
            actionDescription = 'update';
          } else if (actions.includes('delete')) {
            prefix = '-';
            actionDescription = 'delete';
          } else if (actions.includes('replace')) {
            prefix = '+/-';
            actionDescription = 'replace';
          } else {
            prefix = '?';
            actionDescription = actions.join(','); // その他のアクション
          }

          // リソースレベルの差分表示
          diffOutput += `${prefix} resource "${type}" "${name}" (${address}) - ${actionDescription}\n`;

          // TODO: 必要に応じて属性レベルの差分表示を追加 (より複雑なJSONパースが必要)
          // 例: if (change.change.before || change.change.after) { ... 属性の比較と表示 ... }
        });
      } else if (planJson.resource_changes && planJson.resource_changes.length === 0 && planJson.prior_state) {
          // 変更がない場合
          diffOutput += '### No changes\n\nYour infrastructure matches the configuration.';
      } else {
          // JSON構造が予期しない場合やエラー
          diffOutput += '### Could not parse plan JSON\n\n';
          diffOutput += 'Please check the raw plan output if available.\n\n';
          // エラー発生時や予期しないJSONの場合、元のJSONも表示するとデバッグに役立ちます
          // diffOutput += '```json\n' + JSON.stringify(planJson, null, 2) + '\n```';
      }

    } catch (error) {
      // JSONファイルの読み込みやパースに失敗した場合
      diffOutput = `### Error processing plan JSON\n\nAn error occurred while trying to parse the plan output.\nError: ${error.message}\n\n`;
      // エラー発生時、元のplan.jsonの内容を表示するとデバッグに役立ちます
      // try {
      //   const rawPlanContent = fs.readFileSync(planJsonPath, 'utf8');
      //   diffOutput += '### Raw plan.json content:\n\n```json\n' + rawPlanContent + '\n```';
      // } catch (readError) {
      //   diffOutput += `Could not read raw plan.json: ${readError.message}\n`;
      // }
    }

    // GitHub Actionsの出力にコメント本文を設定
    // この形式で設定すると、actions/github-script はこの値をコメントとして使用します
    // https://github.com/actions/github-script#writing-a-comment
    core.setOutput('comment_body', `
    ### \`terraform plan\` Result (Triggered by comment)

    <details><summary>Click to expand plan</summary>

    \`\`\`diff  // GitHubのdiff言語で基本的な色付けを試みる
    ${diffOutput}
    \`\`\`

    </details>

    _Ran on commit \`${context.sha}\`_
    `);
