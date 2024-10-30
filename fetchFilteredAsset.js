import fetch from "node-fetch";
import fs from "fs";
import csv from "csv-parser";

const mintCurrency = "ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx"; // Moeda base

// Função para ler o arquivo CSV e retornar uma lista de assets
function readMintAssetsFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const mintAssets = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (row.mintAsset) {
          mintAssets.push(row.mintAsset);
        }
      })
      .on("end", () => {
        resolve(mintAssets);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// Função para buscar e salvar dados de múltiplos NFTs em JSON
async function fetchMultipleAssetData() {
  try {
    const mintAssets = await readMintAssetsFromCSV("nfts.csv");
    if (mintAssets.length === 0) {
      console.error("Nenhum mintAsset foi encontrado no CSV. Verifique o arquivo.");
      return;
    }

    const fetchPromises = mintAssets.map(async (mintAsset) => {
      const url = `https://api.skullnbones.xyz/get_prices?mint_currency=${mintCurrency}&mint_asset=${mintAsset}`;
      console.log(`Buscando dados para o asset: ${mintAsset} usando a URL: ${url}`);

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { accept: "application/json" }
        });

        if (!response.ok) {
          console.error(`Erro ao acessar a API para o asset ${mintAsset}: ${response.status} - ${response.statusText}`);
          return null;
        }

        const data = await response.json();
        if (!data || Object.keys(data).length === 0) {
          console.warn(`Nenhum dado retornado para o asset ${mintAsset}`);
          return null;
        }
        
        return { mintAsset, ...data };

      } catch (fetchError) {
        console.error(`Erro na requisição para o asset ${mintAsset}:`, fetchError);
        return null;
      }
    });

    const allData = await Promise.all(fetchPromises);

    const validData = allData.filter(data => data !== null);
    fs.writeFileSync("nftsData.json", JSON.stringify(validData, null, 2));
    console.log("Dados dos NFTs salvos no arquivo nftsData.json com sucesso!");

  } catch (error) {
    console.error("Erro ao buscar dados de múltiplos NFTs:", error);
  }
}

// Executa a função
fetchMultipleAssetData();
