import { Request, Response } from "express";
import { PedidoVenda } from "../model/PedidoVenda";

interface PedidoVendaDTO {
    idCarro: number,
    idCliente: number,
    dataPedido: Date,
    valorPedido: number
}

/**
 * A classe `PedidoVendaController` estende a classe `PedidoVenda` e é responsável por controlar as requisições relacionadas aos pedidos de venda.
 * 
 * - Como um controlador dentro de uma API REST, esta classe gerencia as operações relacionadas ao recurso "pedido de venda".
 * - Herdando de `PedidoVenda`, ela pode acessar os métodos e propriedades da classe base.
 */
export class PedidoVendaController extends PedidoVenda {

    /**
     * Lista todos os pedidos de venda.
     * @param req Objeto de requisição HTTP.
     * @param res Objeto de resposta HTTP.
     * @returns Lista de pedidos de venda em formato JSON com status 200 em caso de sucesso.
     * @throws Retorna um status 400 com uma mensagem de erro caso ocorra uma falha ao acessar a listagem de pedidos de venda.
     */
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listaPedidos = await PedidoVenda.listagemPedidos();

            return res.status(200).json(listaPedidos);
        } catch (error) {
            console.log('Erro ao acessar listagem de carros');
            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de carros" });
        }
    }

    /**
* Método controller para cadastrar um novo pedido.
* 
* Esta função recebe uma requisição HTTP contendo os dados de um pedido no corpo da requisição
* e tenta cadastrar este pedido no banco de dados utilizando a função `cadastroPedido`. Caso o cadastro 
* seja bem-sucedido, retorna uma resposta HTTP 200 com uma mensagem de sucesso. Caso contrário, retorna
* uma resposta HTTP 400 com uma mensagem de erro.
* 
* @param {Request} req - Objeto de requisição HTTP, contendo o corpo com os dados do pedido no formato `PedidoDTO`.
* @param {Response} res - Objeto de resposta HTTP usado para retornar o status e a mensagem ao usuário.
* @returns {Promise<Response>} - Retorna uma resposta HTTP com o status 200 em caso de sucesso, ou 400 em caso de erro.
* 
* @throws {Error} - Se ocorrer um erro durante o processo de cadastro, uma mensagem é exibida no console e uma 
*                   resposta HTTP 400 com uma mensagem de erro é enviada ao usuário.
*/
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            // recuperando informações do corpo da requisição e colocando em um objeto da interface PedidoDTO
            const pedidoRecebido: PedidoVendaDTO = req.body;

            // instanciando um objeto do tipo pedido com as informações recebidas
            const novoPedido = new PedidoVenda(
                pedidoRecebido.idCarro,
                pedidoRecebido.idCliente,
                pedidoRecebido.dataPedido,
                pedidoRecebido.valorPedido);

            // Chama a função de cadastro passando o objeto como parâmetro
            const repostaClasse = await PedidoVenda.cadastroPedidoVenda(novoPedido);

            // verifica a resposta da função
            if (repostaClasse) {
                // retornar uma mensagem de sucesso
                return res.status(200).json({ mensagem: "Pedido de Venda cadastrado com sucesso!" });
            } else {
                // retorno uma mensagem de erro
                return res.status(400).json({ mensagem: "Erro ao cadastrar o Pedido de Venda. Entre em contato com o administrador do sistema." })
            }

        } catch (error) {
            // lança uma mensagem de erro no console
            console.log(`Erro ao cadastrar um Pedido de Venda. ${error}`);

            // retorna uma mensagem de erro há quem chamou a mensagem
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o Pedido de Venda. Entre em contato com o administrador do sistema." });
        }
    }

    /**
 * Remove um pedido de venda do sistema com base no ID fornecido.
 * 
 * Esta função recupera o ID do pedido de venda a ser removido a partir dos parâmetros da URL, chama o 
 * método do modelo para realizar a remoção e retorna uma resposta apropriada ao cliente indicando 
 * o sucesso ou falha da operação.
 * 
 * @param {Request} req - Objeto da requisição HTTP contendo o ID do pedido nos parâmetros da URL.
 * @param {Response} res - Objeto da resposta HTTP usado para enviar o status e mensagens ao cliente.
 * @returns {Promise<Response>} - Retorna:
 *   - Status 200 e uma mensagem de sucesso se a remoção for bem-sucedida.
 *   - Status 400 e uma mensagem de erro caso a remoção falhe ou ocorra uma exceção.
 */
    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            // Recupera o ID do pedido de venda a ser removido a partir dos parâmetros da URL.
            const idPedido = parseInt(req.params.idPedido as string);

            // Chama o método do modelo para remover o pedido e armazena o resultado (true ou false).
            const respostaModelo = await PedidoVenda.removerPedido(idPedido);

            // Verifica se a resposta do modelo indica que a remoção foi bem-sucedida.
            if (respostaModelo) {
                return res.status(200).json({ mensagem: "O pedido foi removido com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Erro ao remover o pedido. Entre em contato com o administrador do sistema." });
            }
        } catch (error) {
            // Loga o erro no console para depuração.
            console.error(`Erro ao remover o pedido: ${error}`);

            // Retorna uma resposta HTTP com status 400 e mensagem genérica de erro.
            return res.status(400).json({ mensagem: "Não foi possível remover o pedido. Entre em contato com o administrador." });
        }
    }

    /**
     * Atualiza os dados de um pedido de venda no sistema.
     * 
     * Esta função recupera os dados do pedido a serem atualizados a partir do corpo da requisição (`req.body`) 
     * e o ID do pedido a partir dos parâmetros da URL. Verifica se o ID é válido, cria um objeto `PedidoVenda` 
     * com os dados fornecidos e chama o método do modelo para realizar a atualização. Retorna uma resposta 
     * indicando o sucesso ou a falha da operação.
     * 
     * @param {Request} req - Objeto da requisição HTTP contendo os dados do pedido no corpo e o ID nos parâmetros.
     * @param {Response} res - Objeto da resposta HTTP usado para enviar o status e mensagens ao cliente.
     * @returns {Promise<Response>} - Retorna:
     *   - Status 200 e uma mensagem de sucesso se a atualização for bem-sucedida.
     *   - Status 400 e uma mensagem de erro caso a atualização falhe ou ocorra uma exceção.
     */
    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            // Recupera os dados do pedido de venda a serem atualizados do corpo da requisição.
            const pedidoRecebido: PedidoVendaDTO = req.body;

            // Recupera o ID do pedido de venda a ser atualizado a partir dos parâmetros da URL.
            const idPedidoRecebido = parseInt(req.params.idPedido as string);

            // Verifica se o ID do pedido é válido.
            if (isNaN(idPedidoRecebido) || idPedidoRecebido <= 0) {
                return res.status(400).json({ mensagem: "ID do pedido inválido. Por favor, forneça um ID válido." });
            }

            // Cria um novo objeto `PedidoVenda` com os dados recebidos.
            const pedidoAtualizado = new PedidoVenda(
                pedidoRecebido.idCarro,
                pedidoRecebido.idCliente,
                pedidoRecebido.dataPedido,
                pedidoRecebido.valorPedido
            );

            // Define o ID do pedido no objeto `pedidoAtualizado`.
            pedidoAtualizado.setIdPedido(idPedidoRecebido);

            // Chama o método do modelo para atualizar o pedido e armazena a resposta (true ou false).
            const respostaModelo = await PedidoVenda.atualizarPedido(pedidoAtualizado);

            // Verifica se a resposta do modelo indica que o pedido foi atualizado com sucesso.
            if (respostaModelo) {
                return res.status(200).json({ mensagem: "Pedido atualizado com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Não foi possível atualizar o pedido. Entre em contato com o administrador." });
            }
        } catch (error) {
            // Loga o erro no console para depuração.
            console.error(`Erro ao atualizar o pedido: ${error}`);

            // Retorna uma resposta HTTP com status 400 e mensagem genérica de erro.
            return res.status(400).json({ mensagem: "Não foi possível atualizar o pedido. Entre em contato com o administrador." });
        }
    }


}