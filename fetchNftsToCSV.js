import fetch from "node-fetch";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";

// URL da API de Star Atlas
const url = "https://galaxy.staratlas.com/nfts";

// Configuração do CSV para salvar as colunas "mint" e "name"
const csvWriter = createCsvWriter({
  path: "nfts.csv",
  header: [
    { id: "mint", title: "mintAsset" },  // Define a coluna "mintAsset" para salvar o valor "mint"
    { id: "name", title: "name" },        // Define a coluna "name" para salvar o valor "name"
  ]
});

// Função para buscar e salvar dados dos NFTs
async function fetchAndSaveNFTs() {
  try {
    // Faz a requisição para a API
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro ao acessar a API: ${response.status} - ${response.statusText}`);

    // Converte a resposta para JSON
    const data = await response.json();

    // Prepara os dados para salvar no CSV com as colunas "mint" e "name"
    const records = data.map(nft => ({
      mint: nft.mint || "N/A",    // Salva o campo "mint", com "N/A" como padrão
      name: nft.name || "N/A",     // Salva o campo "name", com "N/A" como padrão
    }));

    // Salva os dados no arquivo CSV
    await csvWriter.writeRecords(records);
    console.log("Dados dos NFTs salvos no arquivo nfts.csv com sucesso!");
  } catch (error) {
    console.error("Erro ao buscar dados ou salvar CSV:", error);
  }
}

// Executa a função
fetchAndSaveNFTs();
