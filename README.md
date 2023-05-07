# GRIM RECKONING - Proyecto final React

![image](https://user-images.githubusercontent.com/122631261/236699251-aeb58f71-57ed-446d-9b4b-b1b395d38f6a.png)

Primera versión: mayo 2023

## Tabla de contenidos

- [Cómo funciona 🎮](#cómo-funciona)
- [Referencias estéticas 📷](#referencias-estéticas)
- [Desarrollo ⛏️](#desarrollo)
- [Errores conocidos ⛑️](#errores-conocidos)
- [Futuras funcionalidades 💻](#futuras-funcionalidades)
- [Licencia y Copyright 📃](#licencia-y-copyright)

![grimreckoning-banner](https://user-images.githubusercontent.com/122631261/236699023-3786d1b2-d2a1-488b-8b76-ea5822790a10.jpg)

Gracias por visitar mi videojuego web **Grim Reckoning - the shattered kingdom**. Grim Reckoning es un videojuego web desarrollado en React. 

<div align="center">
   🎬  <a href="https://www.youtube.com/watch?v=JZwAMuQmA08"><strong>VÍDEO DE PRESENTACIÓN </strong></a> 🎬 
</div>
<br>

El objetivo en Grim Reckoning es descubrir los misterios de la aldea de Ravenhollow, y podrás hacerlo a través de un sistema de conversaciones aleatorias con sus aldeanos en el que podrás elegir tus respuestas, cambiando con ellas el rumbo de la conversación.

La aldea encierra peligrosos monstruos a los que tus héroes deberán combatir. Podrás crear héroes y mejorarlos con equipo para el combate y subidas de nivel, que sólo alcanzarás conforme acabes con tus enemigos. Sólo los héroes más valerosos serán capaces de acabar con todos los monstruos distintos que habitan Ravenhollow y se convertirán en los héroes más famosos de este oscuro reino.

El proyecto realiza llamadas a una API desarrollada en PHP Laravel: <a href="https://github.com/felipebaguena/fbp_bbdd_proyecto_final_gh_2023"><strong>enlace al repositorio del backend </strong></a>. Desde la web del juego, podrás registrate, acceder a zonas de usuario, visitar y modificar el perfil, además de crear y eliminar héroes, ítems de tu inventariom, consultar los monstruos derrotados por los héroes y el ranking de los héroes que más enemigos han eliminado. Como administrador, tendrán diferentes herramientas de gestión, pudiendo consultar los datos de los usuarios, sus héroes, objetos, actualizar sus permisos en la web y eliminar sus fichas.

<div align="center">
   🚀 <a href="https://master.d5blyjw0pih23.amplifyapp.com/"><strong>ENLACE A LA WEB </strong></a> 🚀
</div>

### Cómo funciona

- Desde la vista raíz, en el home, podrás acceder a las historias de Ravenhollow y al ranking de lo héroes más famosos del reino, pero deberás registrate para empezar con tus aventuras. Una vez registrado, podrás acceder a tu perfil, editando tus nombre y contraseña si así lo deseas, consultar tus héroes y su inventario, gestionarlos, pudiendo crearlos o eliminarlos, además de organizar sus objetos descartando los que ya no te sean útiles.

- Cuando quieras arrancar tus primeras aventuras tendrás que crear un héroe, eligiendo su nombre, escribiendo un breve trasfondo y escogiendo entre los diferentes aspectos disponibles. Tu héroe, de nivel uno, recibirá unos valores iniciales aleatorios, que quedarán ocultos, y un primer objeto de combate también aleatorio.

- Los combates de la aventura son aleatorios, tanto en lo que respecta a los monstruos como al escenario. Tanto el daño infligido como el recibido dependen de diferentes factores: la estadística de ataque y defensa del héroe y del monstruo, y los modificadores a la defensa y el ataque del escenario y del objeto equipado. Además, existe un rango de daño aleatorio en cada golpe, así como la posibilidad de efectuar daño crítico, duplicando el poder del golpe, y de fallaro. Los ataques irán vaciando el contenedor de vida de héroe y monstruo, representado por las barras de colores sobre las que se sitúan sus nombres.

![grim-reckoning-1](https://user-images.githubusercontent.com/122631261/236699143-7b81999d-ced2-4b0d-8b89-643fd4fbb12a.gif)


- Además del botón de ataque, tendrás un botón de defensa, que servirá para aumentar tu estadística de defensa y la probabilidad de fallo de tu enemigo. Este botón hace que corra el turno, así que tendrás que valorar en todo momento la estrategia que vas a seguir para acabar con tu enemigo. Pulsado cuatro veces el botón de defensa, el héroe alcanzará la defensa máxima y el botón quedará desactivado.

- El héroe también tendrá a su disposición cuatro pociones para recuperar parte de su vida, a diferencia del botón de defensa, estas no se reinician entre batallas, así que tendrás que administrarlas correctamente, especialmente cuando busques encadenar un gran número de victorias consecutivas.

- El aumento de nivel dependerá de las victorias encadenadas que logra el héroe, y las rachas de victorias necesarias para subir, cada vez serán más largas. Con cada nuevo nivel, el héroe recibe un aumento aleatorio en sus estadísticas de combate, además de lograr que el uso de los objetos sea más eficaz. Sin embargo, los monstruos también se volverán más hábiles en sus combates, equilibrando en parte el avance en la aventura.

- Con cada monstruo eliminado, el héroe tendrá una posibilidad de encontrar botín con objetos aleatorios. Los hay de distintos grados de rareza: objetos comunes, raros, épicos y legendarios. Los más poderosos también serán los más difíciles de encontrar.

- Hay más de un centenar de enemigos distintos, cada uno con diferente nivel de dificultad y conseguir acabar con todos requerirá de buenos objetos, haber gestionado correctamente las pociones y estrategias de combate efectivas, sobre todo cuando te cruces con los enemigos más difíciles de superar del juego.

- En tu zona de héroes podrás consultar los diferentes tipos de monstruos a los que has derrotado. Todos están numerados y tienen una descripción. También tendrás un contador que te indicará cuántos enemigos diferentes te faltan por abatir.

- Además de la lista de monstruos diferentes eliminados por cada héroe, estos tendrán un contador total de bajas enemigas, que determinará su posición en el ranking global del juego, pudiendo competir con otros jugadores por los primeros puestos.

![grim-reckoning-2](https://user-images.githubusercontent.com/122631261/236699156-25a8056c-bf32-4667-be07-7163f3589a80.gif)

- Si buscas explorar los oscuros secretos que se esconden tras la maldición de la aldea de Ravenhollow, tienes disponible el texto con la historia del reino y los eventos que lo llevaron a su caída. Pero también podrás mantener conversaciones aleatorias con diferentes habitantes de la aldea, pudiendo elegir entre distintas opciones para continuar con la conversación. Dependiendo de la opción escogida, la conversación avanzará en una u otra dirección, con sorprendentes revelaciones.

- El acceso a la aplicación como administrador nos permite gestionar los datos de usuarios. Encontrarás una lista con los usuarios registrados en la web, sus héroes y los objetos que estos poseen. También tendrás disponible un desplegable para actualizar los permisos del usuario que desees, o borrar su registro, si lo ves necesario.

 ### Referencias estéticas
 
 - La estética de la web está inspirada en los clásicos videojuegos de SEGA de la década de los 90, incluyendo las queridas portadas de Mega Drive. Para el juego he apostado por el pixel art y un esquema de colores en menús y textos clásico en los RPG de finales de los 80 y principios de los 90, como los empleados en la saga Phantasy Star o Shining Force.
 
 ![pvm-grim-reckoning](https://user-images.githubusercontent.com/122631261/236699070-3bc5131e-dcbf-4f3a-817d-ce74804e9c68.jpg)
 
 - Los gráficos en combate y las animaciones se desarrollan dentro de un monitor CRT, inspirado en el icónico SONY PVM. Para lograr una mayor inmersión en la estética de los 90, tanto los gráficos mostrados dentro del monitor como los menús y botones tienen un filtro que imita las líneas de escaneado (scanlines) habituales en los televisores CRT funcionando a 15KHz.


### Desarrollo

- Tecnologías utilizadas:

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Adobe Photoshop](https://img.shields.io/badge/adobe%20photoshop-%2331A8FF.svg?style=for-the-badge&logo=adobe%20photoshop&logoColor=white)
 
 
- Todo el proyecto está desarrollado en React, empleando elementos de JavaScript, HTML5, CSS, Bootstrap, Dayjs. También he empleado Adobe Photoshop CS6 para los elementos gráficos, además de trabajar con Visual Studio Code y Google Chrome.

- La web está preparada para funcionar perfectamente tanto en monitores de sobremesa como en pantallas de dispositivos móviles, adaptando su aspecto a las resoluciones de tablets y smartphones.

![grimreckoningresponsive-2](https://user-images.githubusercontent.com/122631261/236699132-f5e342f1-1d57-405f-b580-1ddb0e18d2ca.jpg)
 
 ### Errores conocidos:
 
- En algunas vistas, el tiempo de carga es superior al deseable.

- El acceso a algunas funcionalidades de los héroes no está protegido, permitiendo emplear trampas para avanzar fácilmente en el juego.

 ### Futuras funcionalidades:
 
- Muchos de los endpoints desarrollados en el backend todavía no cuentan con un acceso desde el frontend, en especial los que tienen que ver con la gestión de monstruos, objetos y escenarios. En el futuro ampliaremos la vista de administrador, dando acceso a modificación, borrado y creación de monstruos, objetos y escenarios.

### Licencia y Copyright

- Todo el contenido del repositorio se encuentra bajo licencia MIT. El logotipo de Grim Reckoning es propiedad de **Felipe Báguena Peña**.

- La música empleada para el vídeo de presentación del juego está creada por <a href="https://sonatina.itch.io/sibz-selection">Sara Garrard</a>.

- Las imágenes empleadas en las portadas y banners son propiedad de <a href="https://www.artstation.com/artwork/4PK61">Raphael Lacoste</a>, <a href="https://www.artstation.com/artwork/nYyyAK">yann simon_Damdeo</a>, <a href="https://avatars.alphacoders.com/avatars/view/116426">Andrew Krivulya</a>, <a href="https://www.reddit.com/r/midjourney/comments/105v5ak/i_love_fantasy_and_libraries_are_a_fun_and_quiet/">troubledguy0709</a> y <a href="http://www.jonasdero.com/">Jonas De Ro</a>.

- Los monstruos y héroes están creados por el equipo de <a href="https://itch.io/profile/deepdivegamestudio">DeepDiveGameStudio</a>. 

- Los fondos para los escenarios son obra de <a href="https://jestan.itch.io/pixel-texture-pack">JestanDA</a>.

## Agradecimientos:

Agradezco a mis compañeros el tiempo dedicado a este proyecto:

- **Jose**  
<a href="https://github.com/JoseMarin" target="_blank"><img src="https://img.shields.io/badge/github-24292F?style=for-the-badge&logo=github&logoColor=white" target="_blank"></a> 

- **David**  
<a href="https://github.com/Dave86dev" target="_blank"><img src="https://img.shields.io/badge/github-24292F?style=for-the-badge&logo=github&logoColor=red" target="_blank"></a>

- ***Mara***  
<a href="https://github.com/MaraScampini" target="_blank"><img src="https://img.shields.io/badge/github-24292F?style=for-the-badge&logo=github&logoColor=green" target="_blank"></a> 

- ***Dani***  
<a href="https://github.com/datata" target="_blank"><img src="https://img.shields.io/badge/github-24292F?style=for-the-badge&logo=github&logoColor=green" target="_blank"></a> 

## Contacto

- ***Felipe Báguena***  
<a href = "mailto:felipebaguena@gmail.com"><img src="https://img.shields.io/badge/Gmail-C6362C?style=for-the-badge&logo=gmail&logoColor=white" target="_blank"></a>
<a href="https://github.com/felipebaguena" target="_blank"><img src="https://img.shields.io/badge/github-24292F?style=for-the-badge&logo=github&logoColor=green" target="_blank"></a> 
<a href="https://www.linkedin.com/in/felipe-b%C3%A1guena-b20689269/" target="_blank"><img src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a>
