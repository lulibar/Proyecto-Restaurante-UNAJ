<div align="center">

  <h1>RestoApp 🍽️</h1>
  <h3>Sistema Integral de Menú Digital & Gestión de Comandas</h3>

  <p>
    <b>Arquitectura API REST • Clean Architecture • Gestión en Tiempo Real</b>
  </p>

  <p>
    <a href="#-demostración">
      <img src="https://img.shields.io/badge/STATUS-COMPLETADO-success?style=for-the-badge&logo=checkbox&logoColor=white" alt="Status" />
    </a>
    <a href="#-documentación-api">
      <img src="https://img.shields.io/badge/DOCS-SWAGGER_UI-2496ED?style=for-the-badge&logo=swagger&logoColor=white" alt="Swagger" />
    </a>
  </p>
</div>

---

## 💡 Sobre el Proyecto

Este proyecto surge de la necesidad de modernizar la experiencia gastronómica, reemplazando la carta física por una aplicación web dinámica. El sistema permite a los clientes visualizar el menú y realizar pedidos, mientras que el personal del restaurante gestiona el ciclo de vida de las comandas en tiempo real.

El desarrollo se realizó en tres etapas incrementales, cumpliendo con estándares de **Clean Code** y principios **SOLID**:
1.   **Persistencia:** Diseño del modelo relacional y ORM Code-First.
2.  **Backend Logic:** API Restful con reglas de negocio complejas y validaciones.
3.  **Frontend UX/UI:** Interfaz web para clientes y panel administrativo para el staff[cite: 201, 208].

---

## 🌟 Funcionalidades Principales

### 📱 Para el Cliente
* **Menú Digital:** Navegación por categorías (Entradas, Pastas, Bebidas, etc.) con imágenes y precios.
* **Filtros Avanzados:** Búsqueda de platos por nombre, categoría y ordenamiento por precio (ASC/DESC).
* **Personalización:** Posibilidad de agregar notas a cada plato (ej: "Sin sal", "Punto medio").
* **Tipos de Pedido:**
    * 🏢 **Salón:** Se registra número de mesa.
    * 🥡 **Take Away:** Se registra nombre del comensal.
    * 🛵 **Delivery:** Se registra dirección de envío.

### 👨‍🍳 Para el Restaurante
* **Panel de Comandas:** Visualización centralizada de todas las órdenes activas.
* **Flujo de Estados:** Gestión del ciclo de vida: `Pendiente` ➔ `En Preparación` ➔ `Listo` ➔ `Entregado`.
* **Cálculo Automático:** El total de la orden se calcula en el backend al crear el pedido.
* **Transiciones Lógicas:** La orden cambia de estado automáticamente si todos sus ítems avanzan de estado.
---

## 🏗️ Arquitectura del Sistema

El sistema implementa una **Arquitectura en Capas** desacoplada, exponiendo servicios a través de una API REST que alimenta al Frontend.

```mermaid
graph TD
    %% ESTILOS
    classDef frontend fill:#E1F5FE,stroke:#0277BD,stroke-width:2px,color:#000000;
    classDef backend fill:#FFF8E1,stroke:#FF8F00,stroke-width:2px,color:#000000;
    classDef db fill:#F3E5F5,stroke:#7B1FA2,stroke-width:2px,color:#000000,stroke-dasharray: 5 5;
    
    %% NODOS
    Client[("💻 Single Page App\n(HTML/CSS/JS)")]:::frontend
    API[("⚙️ REST API Controller")]:::backend
    Service[("🧠 Business Logic Layer")]:::backend
    Data[("🗄️ Data Access / ORM")]:::backend
    DB[("🐘 Base de Datos Relacional")]:::db

    %% RELACIONES
    Client <==>|"JSON / HTTP Methods"| API
    API <==>|"DTOs"| Service
    Service <==>|"Entities"| Data
    Data <==>|"SQL Queries"| DB
