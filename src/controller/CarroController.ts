import { Request, Response } from "express";
import { Carro } from "../model/Carro";
import { json } from "stream/consumers";

interface CarroDTO {
    marca: string,
    modelo: string,
    ano: number,
    cor: string
}

/**
 * A classe `CarroController` estende a classe `Carro` e é responsável por controlar as requisições relacionadas aos carros.
 * 
 * - Esta classe atua como um controlador dentro de uma API REST, gerenciando as operações relacionadas ao recurso "carro".
 * - Herdando de `Carro`, ela pode acessar métodos e propriedades da classe base.
 */
export class CarroController extends Carro {

    /**
    * Lista todos os carros.
    * @param req Objeto de requisição HTTP.
    * @param res Objeto de resposta HTTP.
    * @returns Lista de carros em formato JSON com status 200 em caso de sucesso.
    * @throws Retorna um status 400 com uma mensagem de erro caso ocorra uma falha ao acessar a listagem de carros.
    */
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            // acessa a função de listar os carros e armazena o resultado
            const listaDeCarros = await Carro.listarCarros();

            // retorna a lista de carros há quem fez a requisição web
            return res.status(200).json(listaDeCarros);
        } catch (error) {
            // lança uma mensagem de erro no console
            console.log('Erro ao acessar listagem de carros');

            // retorna uma mensagem de erro há quem chamou a mensagem
            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de carros" });
        }
    }

    /**
    * Método controller para cadastrar um novo carro.
    * 
    * Esta função recebe uma requisição HTTP contendo os dados de um carro no corpo da requisição
    * e tenta cadastrar este carro no banco de dados utilizando a função `cadastroCarro`. Caso o cadastro 
    * seja bem-sucedido, retorna uma resposta HTTP 200 com uma mensagem de sucesso. Caso contrário, retorna
    * uma resposta HTTP 400 com uma mensagem de erro.
    * 
    * @param {Request} req - Objeto de requisição HTTP, contendo o corpo com os dados do carro no formato `CarroDTO`.
    * @param {Response} res - Objeto de resposta HTTP usado para retornar o status e a mensagem ao cliente.
    * @returns {Promise<Response>} - Retorna uma resposta HTTP com o status 200 em caso de sucesso, ou 400 em caso de erro.
    * 
    * @throws {Error} - Se ocorrer um erro durante o processo de cadastro, uma mensagem é exibida no console e uma 
    *                   resposta HTTP 400 com uma mensagem de erro é enviada ao cliente.
    */
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            // recuperando informações do corpo da requisição e colocando em um objeto da interface CarroDTO
            const carroRecebido: CarroDTO = req.body;

            // instanciando um objeto do tipo carro com as informações recebidas
            const novoCarro = new Carro(carroRecebido.marca,
                carroRecebido.modelo,
                carroRecebido.ano,
                carroRecebido.cor);

            // Chama a função de cadastro passando o objeto como parâmetro
            const repostaClasse = await Carro.cadastroCarro(novoCarro);

            // verifica a resposta da função
            if (repostaClasse) {
                // retornar uma mensagem de sucesso
                return res.status(200).json({ mensagem: "Carro cadastrado com sucesso!" });
            } else {
                // retorno uma mensagem de erro
                return res.status(400).json({ mensagem: "Erro ao cadastra o carro. Entre em contato com o administrador do sistema." })
            }

        } catch (error) {
            // lança uma mensagem de erro no console
            console.log(`Erro ao cadastrar um carro. ${error}`);

            // retorna uma mensagem de erro há quem chamou a mensagem
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o carro. Entre em contato com o administrador do sistema." });
        }
    }

    /**
    * Remove um carro do sistema com base no ID fornecido na requisição.
    * 
    * Esta função recupera o ID do carro a ser removido a partir dos parâmetros da requisição, chama o método 
    * de remoção no modelo (Carro.removerCarro) e retorna uma resposta apropriada para o cliente indicando 
    * o sucesso ou a falha da operação.
    * 
    * @param {Request} req - Objeto da requisição HTTP, contendo os parâmetros e informações enviadas pelo cliente.
    *                        O parâmetro idCarro deve ser passado na URL da requisição.
    * @param {Response} res - Objeto da resposta HTTP, usado para enviar a resposta ao cliente.
    * @returns {Promise<Response>} - Retorna uma resposta HTTP com status apropriado e uma mensagem em JSON:
    *                                - Status 200 e mensagem de sucesso se o carro for removido.
    *                                - Status 400 e mensagem de erro em caso de falha na remoção ou exceção.
    * 
    * @throws {Error} - Exibe uma mensagem de erro no console caso ocorra uma exceção durante o processo.
    */
    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            // Recupera o ID do carro a partir dos parâmetros da requisição e converte para número.
            const idCarro = parseInt(req.params.idCarro as string);

            // Chama o método do modelo para remover o carro e armazena a resposta (true ou false).
            const respostaModelo = await Carro.removerCarro(idCarro);

            // Verifica se a resposta do modelo indica que o carro foi removido com sucesso.
            if (respostaModelo) {
                // Retorna uma resposta HTTP com status 200 e mensagem de sucesso.
                return res.status(200).json({ mensagem: "O carro foi removido com sucesso!" });
            } else {
                // Retorna uma resposta HTTP com status 400 e mensagem de erro.
                return res.status(400).json({ mensagem: "Erro ao remover o carro. Entre em contato com o administrador do sistema." });
            }
        } catch (error) {
            // Loga o erro no console para depuração.
            console.log(`Erro ao remover o carro: ${error}`);

            // Retorna uma resposta HTTP com status 400 e mensagem de erro genérica para o cliente.
            return res.status(400).json({ mensagem: "Não foi possível remover o carro. Entre em contato com o administrador do sistema." });
        }
    }

    /**
    * Atualiza as informações de um carro no sistema.
    * 
    * Esta função recupera os dados do carro a serem atualizados a partir do corpo da requisição (req.body) 
    * e o ID do carro a partir dos parâmetros da URL. Em seguida, cria um objeto Carro com os dados 
    * fornecidos, chama o método de atualização no modelo (Carro.atualizarCarro) e retorna uma resposta 
    * apropriada ao cliente com o status da operação.
    * 
    * @param {Request} req - Objeto da requisição HTTP, contendo os dados do carro no corpo da requisição e 
    *                        o ID do carro nos parâmetros da URL.
    * @param {Response} res - Objeto da resposta HTTP, usado para enviar a resposta ao cliente.
    * @returns {Promise<Response>} - Retorna uma resposta HTTP com status e mensagem:
    *                                - Status 200 e mensagem de sucesso se o carro for atualizado.
    *                                - Status 400 e mensagem de erro em caso de falha na atualização ou exceção.
    * 
    * @throws {Error} - Exibe uma mensagem de erro no console em caso de falha no processo.
    */
    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            // Recupera os dados do carro a serem atualizados do corpo da requisição.
            const carroRecebido: CarroDTO = req.body;

            // Recupera o ID do carro a ser atualizado a partir dos parâmetros da URL.
            const idCarroRecebido = parseInt(req.params.idCarro as string);

            // Cria um novo objeto Carro com os dados recebidos.
            const carroAtualizado = new Carro(
                carroRecebido.marca,
                carroRecebido.modelo,
                carroRecebido.ano,
                carroRecebido.cor
            );

            // Define o ID do carro no objeto carroAtualizado.
            carroAtualizado.setIdCarro(idCarroRecebido);

            // Chama o método do modelo para atualizar o carro e armazena a resposta (true ou false).
            const respostaModelo = await Carro.atualizarCarro(carroAtualizado);

            // Verifica se a resposta do modelo indica que o carro foi atualizado com sucesso.
            if (respostaModelo) {
                // Retorna uma resposta HTTP com status 200 e mensagem de sucesso.
                return res.status(200).json({ mensagem: "Carro atualizado com sucesso!" });
            } else {
                // Retorna uma resposta HTTP com status 400 e mensagem de erro.
                return res.status(400).json({ mensagem: "Não foi possível atualizar o carro. Entre em contato com o administrador." });
            }
        } catch (error) {
            // Loga o erro no console para depuração.
            console.log(`Erro ao atualizar o carro: ${error}`);

            // Retorna uma resposta HTTP com status 400 e mensagem de erro genérica.
            return res.status(400).json({ mensagem: "Não foi possível atualizar o carro. Entre em contato com o administrador." });
        }
    }

}