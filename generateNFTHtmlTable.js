import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho do arquivo de saída
const outputHtmlFilePath = path.join(__dirname, 'Nfts_Metadata.html');

// Mapeamento de colunas para personalizar o cabeçalho
const columnMapping = {
  'mint': 'MintAsset',
  'name': 'Nome',
  'description': 'Descrição',
  'attributes:itemType': 'Tipo de Item',
  'attributes:category': 'Categoria',
  'symbol': 'Símbolo',
  'totalSupply': 'Fornecimento Total',
  'network': 'Rede',
  'image': 'Imagem',  // Exibirá a URL ou uma miniatura da imagem, se disponível
};

// Função para buscar dados da API e gerar o HTML
async function generateHtmlFromApi() {
  try {
    const response = await fetch('https://galaxy.staratlas.com/nfts');
    const data = await response.json();

    if (!data || data.length === 0) {
      console.error("Erro: Nenhum dado retornado pela API.");
      return;
    }

    const htmlContent = generateHtmlTable(data);

    fs.writeFileSync(outputHtmlFilePath, htmlContent, 'utf8');
    console.log('Arquivo HTML gerado com sucesso em Nfts_Metadata.html');
  } catch (error) {
    console.error("Erro ao carregar dados da API ou ao gerar o arquivo HTML:", error);
  }
}

// Função para gerar a tabela HTML
function generateHtmlTable(data) {
  // Extrai os cabeçalhos com base no mapeamento
  const headers = Object.keys(columnMapping).map(column => columnMapping[column] || column);

  // Estrutura básica do HTML
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>NFTs Metadata</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #2e2e2e;
          color: #ffffff;
          margin: 0;
          padding: 0;
        }
        h1 {
          text-align: center;
          color: #ffffff;
          margin-top: 50px; /* Espaço acima da tabela */
        }
        .logo {
          position: absolute;
          top: 30px;
          left: 30px;
          width: 100px;
          height: auto;
        }
        table {
          width: 90%;
          border-collapse: collapse;
          margin: 20px auto;
          margin-top: 50px; /* Distância adicional abaixo do título */
        }
        th, td {
          padding: 8px;
          text-align: left;
          border: 1px solid #ffffff;
          background-color: transparent;
          color: #ffffff;
          max-height: 20px; /* Define a altura máxima */
          overflow: hidden; /* Esconde conteúdo extra */
        }
        th {
          background-color: #444;
        }
        tr:nth-child(even) {
          background-color: rgba(255, 255, 255, 0.1);
        }
        tr:nth-child(odd) {
          background-color: rgba(255, 255, 255, 0.2);
        }
      </style>
    </head>
    <body>
      <!-- Imagem do logo -->
      <img src="https://i.imgur.com/Jpm5jkS.png" alt="Logo" class="logo">
      <h1>NFT METADATA</h1>
      <table>
        <thead>
          <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
        </thead>
        <tbody>
  `;

  data.forEach(item => {
    html += '<tr>';
    Object.keys(columnMapping).forEach(column => {
      const keys = column.split(':');
      const value = keys.reduce((acc, key) => acc && acc[key], item) || 'N/A';

      // Exibe a imagem se for o campo 'image' e uma URL de imagem
      if (column === 'image' && value !== 'N/A') {
        html += `<td><img src="${value}" alt="NFT Image" style="width: 50px; height: auto;"></td>`;
      } else {
        html += `<td>${value}</td>`;
      }
    });
    html += '</tr>';
  });

  html += `
        </tbody>
      </table>
    </body>
    </html>
  `;

  return html;
}

// Executa a função para gerar o HTML
generateHtmlFromApi();
