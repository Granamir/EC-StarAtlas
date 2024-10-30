// Importação do módulo 'fs' para operações com o sistema de arquivos
const fs = require("fs");

// Defina o endereço do token NFT de Star Atlas (tokenMint)
const tokenMint = "M1NTq6mJnYhyhRe1ZRum1v54AqHmvo4mYYGk7tcFcHn"; // Substitua pelo endereço do token NFT

// URL da API Solscan para o histórico de transações do NFT
const url = `https://public-api.solscan.io/nft/activities?token_address=${tokenMint}`;

// Função para buscar dados do histórico de transações do NFT
async function fetchNftTransactionHistory() {
    try {
        // Importa dinamicamente o 'node-fetch'
        const fetch = (await import("node-fetch")).default;

        // Faz uma requisição GET para o endpoint da Solscan
        const response = await fetch(url, {
            method: "GET",
            headers: { "accept": "application/json" }
        });

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) throw new Error(`Erro ao acessar a API: ${response.status} - ${response.statusText}`);

        // Converte a resposta para JSON
        const data = await response.json();

        if (data && data.length > 0) {
            console.log("Histórico de Transações do NFT:", data);

            // Opcional: Exporta os dados para CSV
            exportToCSV(data, "nft_market_data.csv");
        } else {
            console.log("Nenhum dado de transação encontrado para este token.");
        }
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
    }
}

// Função para exportar dados para CSV
function exportToCSV(data, filename) {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(",")); // Cabeçalhos

    // Formata os dados em CSV
    for (const row of data) {
        const values = headers.map(header => JSON.stringify(row[header] || ""));
        csvRows.push(values.join(","));
    }

    // Salva o arquivo CSV
    const csvString = csvRows.join("\n");
    fs.writeFileSync(filename, csvString);
    console.log(`Dados exportados para ${filename} com sucesso!`);
}

// Chame a função para buscar os dados
fetchNftTransactionHistory();
