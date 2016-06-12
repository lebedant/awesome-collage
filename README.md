# Awesome collage


### Cíl

Cílem této semestrální práce bylo vytvořit klientskou javascript aplikaci pro tvorbu koláže. Hlavní myšlenka spočívá v tom, že uživatel může vytvořit svoji vlastní šablonu (rozdělení plochy).

### Postup

Celý projekt se skládá že 3 tříd: **Canvas**, **MyNode**, **Rect**, souboru "Main.js" s namespace **kaj**, který obsahuje veřejné funkce a souboru "scrollPage.js" pro pohodlnou navigaci ve stránce.

Třída **Canvas** představuje celý koláž v podobě html prvku *canvas*. Tato třída se zabývá událostmi na *canvas* takovými jako "contextmenu", "click" a "drag&drop" a také překresluje celý koláž.

Třída **MyNode** představuje jednotlivé oblasti koláže (vzniklé oblasti po zozdeleni). Kazda taková oblast má svoje vlastní kontextní menu a slider pro změnu rozdělení. V podstatě, je to uzel v binárním kd-stromu. Každý uzel má osu podle které je rozdělen ("x" nebo "y") a hodnotu tohoto rozdělení (0..1) a také 2 potomky-uzly: *left* a *right* (*left* je vždy min nebo roven hodnotě rozdělení). Také tato třída rukurzivne vyhledává uzel (list) podle pozkytnute souřadnici (pozice cursoru) a maže rozdělení.

Třída **Rect** slouží pro pohodlně udření pozici a rozměrů každého uzlu (z preschoziho odstavců).

### Popis funkčnosti

Funkčnost aplikace je popsána v sekci "About" (na webu projektu).

Aplikace funguje i offline. Má responsive design a cross-browsernost.



