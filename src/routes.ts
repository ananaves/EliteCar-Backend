import { Request, Response, Router } from "express";
import { CarroController } from "./controller/CarroController";
import { ClienteController } from "./controller/ClienteController";
import { PedidoVendaController } from "./controller/PedidoVendaController";

// Cria um roteador
const router = Router();

// Criando uma rota principal para a aplicação
router.get("/", (req: Request, res: Response) => {
    res.json({ mensagem: "Olá, mundo!" });
});

/* 
* ROTAS PARA CARROS
*/
// Rota para listar os carros
router.get("/lista/carros", CarroController.todos);
// Rota para adicionar carro
router.post("/novo/carros", CarroController.novo);
// Rota para deletar carro
router.delete("/delete/carros/:idCarro", CarroController.remover);
// Rota para atualizar carro
router.put("/atualizar/carros/:idCarro", CarroController.atualizar);

/* 
* ROTAS PARA CLIENTES
*/
// Rota para listar os clientes
router.get("/lista/clientes", ClienteController.todos);
// Rota para adicionar cliente
router.post("/novo/clientes", ClienteController.novo);
// Rota para deletar cloente
router.delete("/delete/clientes/:idCliente", ClienteController.remover);
// Rota para atualizar cliente
router.put("/atualizar/clientes/:idCliente", ClienteController.atualizar);

/* 
* ROTAS PARA PEDIDOS
*/ 
// Rota para listar os pedidos
router.get("/lista/pedidos", PedidoVendaController.todos);
// Rota para cadastrar os pedidos
router.post("/novo/pedido", PedidoVendaController.novo);
// Rota para deletar os pedidos
router.delete("/delete/pedido/:idPedido", PedidoVendaController.remover);
// Rota para atualizar os pedidos
router.put("/atualizar/pedido/:idPedido", PedidoVendaController.atualizar);

// exportando as rotas
export { router };