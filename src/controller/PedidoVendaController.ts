import { Request, Response } from "express";
import { PedidoVenda } from "../model/PedidoVenda";

interface PedidoVendaDTO {
    id_carro: number,
    id_cliente: number,
    data_pedido: Date,
    valor_pedido: number
}

/**
 * A classe `PedidoVendaController` estende a classe `PedidoVenda` e é responsável por controlar as requisições relacionadas aos pedidos e vendas.
 * 
 * - Esta classe atua como um controlador dentro de uma API REST, gerenciando as operações relacionadas ao recurso "PedidoVenda".
 * - Herdando de `PedidoVenda`, ela pode acessar métodos e propriedades da classe base.
 */
export class PedidoVendaController extends PedidoVenda {

    /**
    * Lista todos os pediddos e vendas.
    * @param req Objeto de requisição HTTP.
    * @param res Objeto de resposta HTTP.
    * @returns Lista de pedidos e vendas em formato JSON com status 200 em caso de sucesso.
    * @throws Retorna um status 400 com uma mensagem de erro caso ocorra uma falha ao acessar a listagem de pedidos e vendas.
    */
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            // acessa a função de listar os pedidos e vendas e armazena o resultado
            const listaDePedidoVenda = await PedidoVenda.listarPedidosVenda();

            // retorna a lista de PedidosVendas há quem fez a requisição web
            return res.status(200).json(listaDePedidoVenda);
        } catch (error) {
            // lança uma mensagem de erro no console
            console.log('Erro ao acessar listagem de Pedidos e Vendas');

            // retorna uma mensagem de erro há quem chamou a mensagem
            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de PedisosVendas" });
        }
    }

    /**
    * Método controller para cadastrar um novo PedidoVenda.
    * 
    * Esta função recebe uma requisição HTTP contendo os dados de um PedidoVenda no corpo da requisição
    * e tenta cadastrar este PedidoVenda no banco de dados utilizando a função `cadastroPedidoVenda`. Caso o cadastro 
    * seja bem-sucedido, retorna uma resposta HTTP 200 com uma mensagem de sucesso. Caso contrário, retorna
    * uma resposta HTTP 400 com uma mensagem de erro.
    * 
    * @param {Request} req - Objeto de requisição HTTP, contendo o corpo com os dados do carro no formato `PedidovendaDTO`.
    * @param {Response} res - Objeto de resposta HTTP usado para retornar o status e a mensagem ao cliente.
    * @returns {Promise<Response>} - Retorna uma resposta HTTP com o status 200 em caso de sucesso, ou 400 em caso de erro.
    * 
    * @throws {Error} - Se ocorrer um erro durante o processo de cadastro, uma mensagem é exibida no console e uma 
    *                   resposta HTTP 400 com uma mensagem de erro é enviada ao cliente.
    */
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            // recuperando informações do corpo da requisição e colocando em um objeto da interface PedidoVendaDTO
            const PedidoVendaRecebido: PedidoVendaDTO = req.body;

            // instanciando um objeto do tipo carro com as informações recebidas
            const novoPedidoVenda = new PedidoVenda(PedidoVendaRecebido.id_carro,
                PedidoVendaRecebido.id_cliente,
                PedidoVendaRecebido.data_pedido,
                PedidoVendaRecebido.valor_pedido);

            // Chama a função de cadastro passando o objeto como parâmetro
            const repostaClasse = await PedidoVenda.cadastroPedidoVenda(novoPedidoVenda);

            // verifica a resposta da função
            if (repostaClasse) {
                // retornar uma mensagem de sucesso
                return res.status(200).json({ mensagem: "Pedido e Venda cadastrado com sucesso!" });
            } else {
                // retorno uma mensagem de erro
                return res.status(400).json({ mensagem: "Erro ao cadastra o Pedido e Venda. Entre em contato com o administrador do sistema." })
            }

        } catch (error) {
            // lança uma mensagem de erro no console
            console.log(`Erro ao cadastrar um Pedido e Venda. ${error}`);

            // retorna uma mensagem de erro há quem chamou a mensagem
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o Pedido e Vendsa. Entre em contato com o administrador do sistema." });
        }
    }
}