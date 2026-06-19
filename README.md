# Tienda web Vitabars

Abre `index.html` en un navegador para ver la tienda.

## Activar ventas reales

En `app.js`, al inicio, reemplaza:

```js
const CONFIG = {
  whatsapp: '51947227596',
  culqiPaymentLink: 'https://express.culqi.com/pago/F7BA793F86'
};
```

- `whatsapp`: ya está configurado con el número oficial encontrado en el repositorio: `51947227596`.
- `culqiPaymentLink`: ya está configurado con el enlace de pago entregado por Culqi.

El botón de WhatsApp crea automáticamente el detalle del carrito y el total. Los botones de tarjeta y Yape abren el enlace seguro de Culqi.

## Delivery y monto de pago

- El delivery cuesta S/ 10.
- Para subtotales desde S/ 100, el delivery es gratis.
- El carrito muestra subtotal, delivery y total, y envía el desglose por WhatsApp.
- El enlace Culqi Express configurado permite que el comprador escriba el monto, pero no recibe automáticamente el total del carrito. La tienda muestra el total y ofrece copiarlo antes de abrir Culqi.
- Para bloquear y enviar el monto automáticamente se necesita integrar Culqi Checkout/API con un backend y credenciales del comercio.

## Antes de publicar

- Reemplaza los productos, precios y descripciones del arreglo `products` en `app.js`.
- Añade las políticas reales de envío, cambios y privacidad.
- Cambia las ilustraciones por fotografías oficiales si están disponibles.
- Para cuentas reales de clientes, historial de pedidos e inventario, conecta un backend. El inicio de sesión incluido es una demostración local y no debe usarse para almacenar contraseñas reales.

Puede publicarse como sitio estático en Netlify, Vercel, Cloudflare Pages o cualquier hosting tradicional.
