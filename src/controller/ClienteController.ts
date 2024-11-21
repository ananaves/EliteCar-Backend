import { Request, Response } from "express";
import { Cliente } from "../model/Cliente";

interface ClienteDTO {
    nome: string,
    cpf: number,
    telefone: number
}

/**
 * A classe `ClienteController` estende a classe `Cliente` e é responsável por controlar as requisições relacionadas aos clientes.
 * 
 * - Esta classe atua como um controlador dentro de uma API REST, gerenciando as operações relacionadas ao recurso "cliente".
 * - Herdando de `Cliente`, ela pode acessar métodos e propriedades da classe base.
 */
export class ClienteController extends Cliente {

    /**
    * Lista todos os clistas.
    * @param req Objeto de requisição HTTP.
    * @param res Objeto de resposta HTTP.
    * @returns Lista de clientes em formato JSON com status 200 em caso de sucesso.
    * @throws Retorna um status 400 com uma mensagem de erro caso ocorra uma falha ao acessar a listagem de clinetes.
    */
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            // acessa a função de listar os clientes e armazena o resultado
            const listaDeClientes = await Cliente.listarClientes();

            // retorna a lista de clientes há quem fez a requisição web
            return res.status(200).json(listaDeClientes);
        } catch (error) {
            // lança uma mensagem de erro no console
            console.log('Erro ao acessar listagem de clientes');

            // retorna uma mensagem de erro há quem chamou a mensagem
            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de clientes" });
        }
    }

    /**
    * Método controller para cadastrar um novo cliente.
    * 
    * Esta função recebe uma requisição HTTP contendo os dados de um cliente no corpo da requisição
    * e tenta cadastrar este cliente no banco de dados utilizando a função `cadastroCliente`. Caso o cadastro 
    * seja bem-sucedido, retorna uma resposta HTTP 200 com uma mensagem de sucesso. Caso contrário, retorna
    * uma resposta HTTP 400 com uma mensagem de erro.
    * 
    * @param {Request} req - Objeto de requisição HTTP, contendo o corpo com os dados do carro no formato `ClienteDTO`.
    * @param {Response} res - Objeto de resposta HTTP usado para retornar o status e a mensagem ao cliente.
    * @returns {Promise<Response>} - Retorna uma resposta HTTP com o status 200 em caso de sucesso, ou 400 em caso de erro.
    * 
    * @throws {Error} - Se ocorrer um erro durante o processo de cadastro, uma mensagem é exibida no console e uma 
    *                   resposta HTTP 400 com uma mensagem de erro é enviada ao cliente.
    */
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            // recuperando informações do corpo da requisição e colocando em um objeto da interface ClienteDTO
            const clienteRecebido: ClienteDTO = req.body;

            // instanciando um objeto do tipo carro com as informações recebidas
            const novoCliente = new Cliente(clienteRecebido.nome,
                clienteRecebido.cpf,
                clienteRecebido.telefone);

            // Chama a função de cadastro passando o objeto como parâmetro
            const repostaClasse = await Cliente.cadastroCliente(novoCliente);

            // verifica a resposta da função
            if (repostaClasse) {
                // retornar uma mensagem de sucesso
                return res.status(200).json({ mensagem: "Cliente cadastrado com sucesso!" });
            } else {
                // retorno uma mensagem de erro
                return res.status(400).json({ mensagem: "Erro ao cadastra o cliente. Entre em contato com o administrador do sistema." })
            }

        } catch (error) {
            // lança uma mensagem de erro no console
            console.log(`Erro ao cadastrar um cliente. ${error}`);

            // retorna uma mensagem de erro há quem chamou a mensagem
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o cliente. Entre em contato com o administrador do sistema." });
        }
    }

    /**
      * Remove um cliente do banco de dados com base no ID fornecido na URL da requisição.
      * 
      * Esta função recebe um ID de cliente da requisição, chama o método do modelo para remover
      * o cliente correspondente e retorna uma resposta HTTP apropriada, dependendo do sucesso ou falha
      * da operação de remoção.
      * 
      * @param {Request} req - Objeto de requisição contendo o ID do cliente nos parâmetros da URL.
      * @param {Response} res - Objeto de resposta utilizado para enviar a resposta HTTP.
      * @returns {Promise<Response>} - Retorna uma resposta HTTP com status 200 para sucesso ou 400 para erro.
      * 
      * @throws {Error} - Caso ocorra um erro, uma resposta HTTP de erro será retornada e o erro será logado no console.
      */
    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            // Recupera o ID do cliente a ser removido a partir dos parâmetros da URL
            const idCliente = parseInt(req.params.idCliente as string);

            // Chama a função do modelo para remover o cliente e armazena a resposta (true ou false)
            const respostaModelo = await Cliente.removerCliente(idCliente);

            // Verifica se a resposta do modelo foi verdadeira (cliente removido com sucesso)
            if (respostaModelo) {
                // Retorna um status 200 com uma mensagem de sucesso
                return res.status(200).json({ mensagem: "O cliente foi removido com sucesso!" });
            } else {
                // Retorna um status 400 com uma mensagem de erro caso a remoção falhe
                return res.status(400).json({ mensagem: "Erro ao remover o cliente. Entre em contato com o administrador do sistema." });
            }

        } catch (error) {
            // Exibe uma mensagem de erro no console caso ocorra uma exceção
            console.log(`Erro ao remover o cliente ${error}`);

            // Retorna uma resposta HTTP com status 400 e uma mensagem de erro genérica
            return res.status(400).json({ mensagem: "Não foi possível remover o cliente. Entre em contato com o administrador do sistema." });
        }
    }

    /**
     * Atualiza os dados de um cliente no banco de dados com base no ID fornecido na URL da requisição.
     * 
     * Esta função recebe os dados do cliente a serem atualizados no corpo da requisição, chama o
     * método do modelo para atualizar o cliente no banco de dados e retorna uma resposta HTTP com o
     * status adequado, dependendo do sucesso ou falha da operação de atualização.
     * 
     * @param {Request} req - Objeto de requisição contendo os dados do cliente no corpo e o ID na URL.
     * @param {Response} res - Objeto de resposta utilizado para enviar a resposta HTTP.
     * @returns {Promise<Response>} - Retorna uma resposta HTTP com status 200 para sucesso ou 400 para erro.
     * 
     * @throws {Error} - Caso ocorra um erro, uma resposta HTTP de erro será retornada e o erro será logado no console.
     */
    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            // Recupera os dados do cliente a serem atualizados do corpo da requisição
            const clienteRecebido: ClienteDTO = req.body;

            // Recupera o ID do cliente a ser atualizado a partir dos parâmetros da URL
            const idClienteRecebido = parseInt(req.params.idCliente as string);

            // Cria um novo objeto Cliente com os dados recebidos da requisição
            const clienteAtualizado = new Cliente(
                clienteRecebido.nome,
                clienteRecebido.cpf,
                clienteRecebido.telefone
            );

            // Define o ID do cliente no objeto clienteAtualizado
            clienteAtualizado.setIdCliente(idClienteRecebido);

            // Chama o método do modelo para atualizar o cliente e armazena a resposta (true ou false)
            const respostaModelo = await Cliente.atualizarCliente(clienteAtualizado);

            // Verifica se a resposta do modelo indica que o cliente foi atualizado com sucesso
            if (respostaModelo) {
                // Retorna uma resposta HTTP com status 200 e mensagem de sucesso
                return res.status(200).json({ mensagem: "Cliente atualizado com sucesso!" });
            } else {
                // Retorna uma resposta HTTP com status 400 e mensagem de erro caso a atualização falhe
                return res.status(400).json({ mensagem: "Não foi possível atualizar o cliente. Entre em contato com o administrador." });
            }
        } catch (error) {
            // Exibe uma mensagem de erro no console caso ocorra uma exceção
            console.log(`Erro ao atualizar o cliente: ${error}`);

            // Retorna uma resposta HTTP com status 400 e uma mensagem de erro genérica
            return res.status(400).json({ mensagem: "Não foi possível atualizar o cliente. Entre em contato com o administrador." });
        }
    }


}