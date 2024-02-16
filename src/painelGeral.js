import { useEffect, useState } from "react";
import Header from "./modules/header.js";
import supabase from "./supabase.js"
import Footer from "./modules/footer.js";
import styled from 'styled-components'
import { Chart } from "react-google-charts";
import "./index.js";
import { insertMaskInCpf } from "./mascaras/cpf.ts";
import { insertMaskInPhone } from "./mascaras/phone.ts";
const formatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' });

const Grafico = styled.div`
    max-width: 80vw;
    margin: auto;
    padding: 20px;
    display: flex;
    justify-content: space-around
`;

const Titulo = styled.h1`
    width: 1000px;
    margin: 20px auto;
    display: flex;
`;

const TituloGraficos = styled.h1`
    width: 1000px;
    margin: 20px auto;
    text-align: center;
    font-size: 40px;
`;
const Data = styled.div`
    margin-left: 10px;
`;

export const data = [
    ["Interesses", "Quantidade"],
    ["Poltrona", 3],
    ["Tapete", 3],
    ["Mesa lateral", 1],
    ["Almofada", 4],
    ["Pufe", 1],
    ["Cadeira", 1],
];

export const options = {
    title: "Maiores interesses",
    is3D: true,
};

export const data2 = [
    ["Data", "Quantidade", { role: "style" }],
    ["01/2024", 25, "#0099C6"],
    ["02/2024", 45, "#0099C6"],
    ["03/2024", 34, "#0099C6"],
];

export const options2 = {
    title: "Clientes"
};

export default function PainelGeral() {
    const [clientes, setClientes] = useState([])

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const { data, error } = await supabase
                    .from("clientes")
                    .select("id, nome, cpf, rua, bairro, cidade, estado, nres, aniversario, ap, celular");
                if (error) {
                    throw error;
                }
                setClientes(data.reverse());
            } catch (error) {
                console.error("Erro ao buscar clientes:", error.message);
            }
        };
        fetchClientes();
    }, []);

    return (
        <main>
            <>
                <Header />
                <main>
                    <Titulo>Seja bem-vindo(a)! <Data>{new Date().toLocaleString().split(",")[0]}</Data></Titulo>
                    <TituloGraficos>Gráficos</TituloGraficos>
                    <Grafico>
                        <Chart
                            chartType="PieChart"
                            data={data}
                            options={options}
                            width={"100%"}
                            height={"400px"}
                        />
                        <Chart
                            chartType="ColumnChart"
                            width="100%"
                            height="400px"
                            options={options2}
                            data={data2}
                        />
                    </Grafico>
                    <h2 className="page-title">Últimos cadastros:</h2>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>CPF</th>
                                <th>Endereço</th>
                                <th>Cidade</th>
                                <th>Celular</th>
                                <th>Aniversário</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes
                                .slice(0, 5)
                                .map((cliente) => (
                                    <tr key={cliente.id}>
                                        <td>{cliente.nome}</td>
                                        <td>{insertMaskInCpf(cliente.cpf)}</td>
                                        <td>{cliente.rua}, {cliente.nres} - {cliente.bairro} {cliente.ap}</td>
                                        <td>{cliente.cidade}, {cliente.estado}</td>
                                        <td>{insertMaskInPhone(cliente.celular)}</td>
                                        <td>{formatter.format(new Date(cliente.aniversario))}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </main>
                <Footer />
            </>
        </main>
    )
}