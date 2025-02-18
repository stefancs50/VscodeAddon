import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    // CodeLens Provider registrieren
    let provider = vscode.languages.registerCodeLensProvider({ scheme: 'file', language: 'plaintext' }, new OpenFolderCodeLensProvider());
    context.subscriptions.push(provider);
}

class OpenFolderCodeLensProvider implements vscode.CodeLensProvider {
    provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] {
        const lenses: vscode.CodeLens[] = [];
        const searchText = "Öffne Ordner";  // Hier anpassen

        for (let line = 0; line < document.lineCount; line++) {
            let textLine = document.lineAt(line);
            let index = textLine.text.indexOf(searchText);

            if (index !== -1) {
                let range = new vscode.Range(line, index, line, index + searchText.length);
                lenses.push(new vscode.CodeLens(range, {
                    title: "📂 Ordner öffnen",
                    command: "extension.openFolder",
                    arguments: ["/Pfad/zum/Ordner"]  // Ordner-Pfad hier anpassen
                }));
            }
        }

        return lenses;
    }
}

// Befehl registrieren
vscode.commands.registerCommand("extension.openFolder", (folderPath: string) => {
    if (fs.existsSync(folderPath)) {
        vscode.commands.executeCommand("revealFileInOS", vscode.Uri.file(folderPath));
    } else {
        vscode.window.showErrorMessage(`Ordner existiert nicht: ${folderPath}`);
    }
});

export function deactivate() {}
