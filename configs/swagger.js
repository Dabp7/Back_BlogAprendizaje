import swaggerUi from 'swagger-ui-express';
export const swaggerDocs={
  "openapi": "3.0.3",
  "info": {
    "title": "Blog de Aprendizaje — demo",
    "version": "2.0.0",
    "description": "Autores de comentarios autodeclarados; datos sintéticos; sin autenticación de lectores."
  },
  "servers": [
    {
      "url": "http://127.0.0.1:3000/kinaloop/v1"
    }
  ],
  "components": {
    "schemas": {
      "CommentInput": {
        "type": "object",
        "required": [
          "author",
          "text",
          "post"
        ],
        "properties": {
          "author": {
            "type": "string",
            "minLength": 2,
            "maxLength": 80
          },
          "text": {
            "type": "string",
            "minLength": 3,
            "maxLength": 1000
          },
          "post": {
            "type": "string",
            "pattern": "^[a-fA-F0-9]{24}$"
          }
        }
      },
      "PostInput": {
        "type": "object",
        "required": [
          "title",
          "text",
          "author",
          "date",
          "category"
        ],
        "properties": {
          "title": {
            "type": "string",
            "minLength": 3,
            "maxLength": 60
          },
          "text": {
            "type": "string",
            "minLength": 3,
            "maxLength": 255
          },
          "author": {
            "type": "string",
            "minLength": 2,
            "maxLength": 80
          },
          "date": {
            "type": "string",
            "format": "date"
          },
          "category": {
            "type": "string"
          },
          "urlImage": {
            "type": "string",
            "format": "uri"
          }
        }
      }
    },
    "securitySchemes": {
      "adminKey": {
        "type": "apiKey",
        "in": "header",
        "name": "X-Admin-Key"
      }
    }
  },
  "paths": {
    "/post/": {
      "get": {
        "summary": "Listar publicaciones activas",
        "parameters": [
          {
            "in": "query",
            "name": "limit",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "maximum": 100,
              "default": 100
            }
          },
          {
            "in": "query",
            "name": "offset",
            "schema": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1000000,
              "default": 0
            }
          },
          {
            "in": "query",
            "name": "category",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Consulta correcta"
          },
          "201": {
            "description": "Recurso creado"
          },
          "400": {
            "description": "Entrada inválida; JSON success=false,message,errors opcional"
          },
          "401": {
            "description": "Clave administrativa inválida"
          },
          "404": {
            "description": "Recurso inexistente o inactivo"
          },
          "413": {
            "description": "Cuerpo demasiado grande"
          },
          "429": {
            "description": "Límite temporal excedido"
          },
          "500": {
            "description": "Error interno genérico"
          }
        }
      }
    },
    "/comment/getCommentsByPost/{idPost}": {
      "get": {
        "summary": "Listar comentarios de publicación activa",
        "parameters": [
          {
            "in": "path",
            "name": "idPost",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "in": "query",
            "name": "limit",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "maximum": 100,
              "default": 100
            }
          },
          {
            "in": "query",
            "name": "offset",
            "schema": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1000000,
              "default": 0
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Consulta correcta"
          },
          "201": {
            "description": "Recurso creado"
          },
          "400": {
            "description": "Entrada inválida; JSON success=false,message,errors opcional"
          },
          "401": {
            "description": "Clave administrativa inválida"
          },
          "404": {
            "description": "Recurso inexistente o inactivo"
          },
          "413": {
            "description": "Cuerpo demasiado grande"
          },
          "429": {
            "description": "Límite temporal excedido"
          },
          "500": {
            "description": "Error interno genérico"
          }
        }
      }
    },
    "/comment/addComment": {
      "post": {
        "summary": "Comentar una publicación activa",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CommentInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Consulta correcta"
          },
          "201": {
            "description": "Recurso creado"
          },
          "400": {
            "description": "Entrada inválida; JSON success=false,message,errors opcional"
          },
          "401": {
            "description": "Clave administrativa inválida"
          },
          "404": {
            "description": "Recurso inexistente o inactivo"
          },
          "413": {
            "description": "Cuerpo demasiado grande"
          },
          "429": {
            "description": "Límite temporal excedido"
          },
          "500": {
            "description": "Error interno genérico"
          }
        }
      }
    },
    "/post/addPost": {
      "post": {
        "summary": "Crear publicación",
        "security": [
          {
            "adminKey": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PostInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Consulta correcta"
          },
          "201": {
            "description": "Recurso creado"
          },
          "400": {
            "description": "Entrada inválida; JSON success=false,message,errors opcional"
          },
          "401": {
            "description": "Clave administrativa inválida"
          },
          "404": {
            "description": "Recurso inexistente o inactivo"
          },
          "413": {
            "description": "Cuerpo demasiado grande"
          },
          "429": {
            "description": "Límite temporal excedido"
          },
          "500": {
            "description": "Error interno genérico"
          }
        }
      }
    },
    "/post/editPost/{idPost}": {
      "put": {
        "summary": "Actualizar campos permitidos",
        "security": [
          {
            "adminKey": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "idPost",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "title": {
                    "type": "string",
                    "minLength": 3,
                    "maxLength": 60
                  },
                  "text": {
                    "type": "string",
                    "minLength": 3,
                    "maxLength": 255
                  },
                  "author": {
                    "type": "string",
                    "minLength": 2,
                    "maxLength": 80
                  },
                  "date": {
                    "type": "string",
                    "format": "date"
                  },
                  "category": {
                    "type": "string"
                  },
                  "urlImage": {
                    "type": "string",
                    "format": "uri"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Consulta correcta"
          },
          "201": {
            "description": "Recurso creado"
          },
          "400": {
            "description": "Entrada inválida; JSON success=false,message,errors opcional"
          },
          "401": {
            "description": "Clave administrativa inválida"
          },
          "404": {
            "description": "Recurso inexistente o inactivo"
          },
          "413": {
            "description": "Cuerpo demasiado grande"
          },
          "429": {
            "description": "Límite temporal excedido"
          },
          "500": {
            "description": "Error interno genérico"
          }
        }
      }
    },
    "/post/deletePost/{idPost}": {
      "delete": {
        "summary": "Desactivar y retirar comentarios transaccionalmente",
        "security": [
          {
            "adminKey": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "idPost",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Consulta correcta"
          },
          "201": {
            "description": "Recurso creado"
          },
          "400": {
            "description": "Entrada inválida; JSON success=false,message,errors opcional"
          },
          "401": {
            "description": "Clave administrativa inválida"
          },
          "404": {
            "description": "Recurso inexistente o inactivo"
          },
          "413": {
            "description": "Cuerpo demasiado grande"
          },
          "429": {
            "description": "Límite temporal excedido"
          },
          "500": {
            "description": "Error interno genérico"
          }
        }
      }
    }
  }
};
export {swaggerUi};
