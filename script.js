document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.getElementById('menu');
  const navLinks = document.querySelector('.links');

  if(menuBtn && navLinks) {
    menuBtn.addEventListener('click', function() {
      // Alternar menú
      navLinks.classList.toggle('active');
      
      // Cambiar ícono entre ☰ y X
      if(navLinks.classList.contains('active')) {
        this.classList.remove('bx-menu-alt-right');
        this.classList.add('bx-x');
      } else {
        this.classList.remove('bx-x');
        this.classList.add('bx-menu-alt-right');
      }
      
      // Bloquear scroll cuando el menú está abierto
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    // Cerrar menú al hacer clic en enlaces
    document.querySelectorAll('.links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuBtn.classList.remove('bx-x');
        menuBtn.classList.add('bx-menu-alt-right');
        document.body.style.overflow = 'auto';
      });
    });
  }
});



const cursor = document.querySelector('.custom-cursor');

// Mueve el cursor
document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});

// Efecto click
document.addEventListener('mousedown', () => {
    cursor.classList.add('click');
});

document.addEventListener('mouseup', () => {
    cursor.classList.remove('click');
});

// Opcional: Cambia color en elementos interactivos
document.querySelectorAll('a, button, input').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.borderColor = "#FF00E4";
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.borderColor = "#00F5FF";
    });
});

// Verifica si el cursor existe antes de moverlo
if (cursor) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.pageX}px`; // Usa pageX/pageY en lugar de clientX/clientY
        cursor.style.top = `${e.pageY}px`;
    });
}

