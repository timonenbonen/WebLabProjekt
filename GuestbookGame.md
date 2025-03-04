# Guestbook Game

## Kontext

Das **Guestbook Game** ist eine webbasierte Anwendung, die als interaktives Gästebuch für Hochzeiten konzipiert wird. Anstatt traditionelle Gästebücher zu verwenden, können Gäste ihre Lieblingssongs über ein WebApp hinzufügen, persönliche Nachrichten hinterlassen und so eine musikalische Erinnerung für das Brautpaar schaffen. Die Web-App integriert die Spotify API, um das Suchen von Songs zu erleichtern und ermöglicht es, Songlisten als eine Sammlung von QR-Codes zu exportieren, die später für ein Musikratespiel genutzt werden können.

## Anforderungen

Sie werden als Software-Architekt und Software Engineer damit beauftragt, die folgenden Anforderungen umzusetzen.

### Fachliche Anforderungen

#### User Story 1: Erstellen von Songlisten (Prio 'Must')

Als eingeloggter Benutzer kann ich leere Songlisten erstellen und den entsprechenden Weblink generieren, damit andere Personen Songs zu dieser Liste hinzufügen können.

**Akzeptanzkriterien:**

- Nach dem Einloggen kann der Benutzer mindestens 5 Songlisten erstellen.
- Für jede Songliste wird ein eindeutiger Weblink generiert.
- Über den teilbaren Weblink können Lieder der Songliste hinzugefügt werden.

#### User Story 2: Songs zur Liste hinzufügen (Prio 'Must')

Als Benutzer mit Zugriff auf den Weblink kann ich Songs zu der Songliste hinzufügen, indem ich Songs über die Spotify API suche.

**Akzeptanzkriterien:**

- Der Benutzer kann drei Felder ausfüllen:
    - **Song-Feld:** Durchsuchbar über die Spotify API (obligatorisches Feld).
    - **Name-Feld:** Name der Person, die den Song hinzufügt (obligatorisches Feld).
    - **Persönliche Nachricht-Feld:** Persönliche Nachricht an das Brautpaar (optionales Feld).
- Songs können nur hinzugefügt werden, wenn beide obligatorischen Felder ausgefüllt sind.
- Duplikat-Prüfung: Vor dem Hinzufügen wird geprüft, ob der Song bereits in der Liste vorhanden ist. Doppelte Songs werden nicht hinzugefügt und der User wird aufgefordert, einen anderen Song zu wählen.
- Die Informationen der verschiendenen Felder werden beim Hinzufügen in einer Datenbank gespeichert.

#### User Story 3: Export von Songlisten als QR-Karten (Prio 'Should')

Als eingeloggter Benutzer kann ich eine Songliste als QR-Karten exportieren, um diese für ein Musikratespiel zu verwenden.

**Akzeptanzkriterien:**

- Für jede Songliste kann ein Export als PDF generiert werden.
- Jede QR-Karte enthält:
    - Vorderseite: Einen QR-Code, der zum Song führt.
    - Rückseite: Den Namen des Songs, den Interpreten, das Erscheinungsdatum und die persönliche Nachricht.
- Die QR-Karten sind für den Druck optimiert.

#### User Story 4: Musikspiel mit QR-Codes (Prio 'Could')

Als Benutzer, der am Spiel teilnehmen möchte, kann ich auf dem Webapp mein Spotify-Konto verknüpfen, um Songs über die QR-Codes abzuspielen und das Spiel zu spielen.

**Akzeptanzkriterien:**

- Der Benutzer kann sich auf dem Webapp über sein Spotify Konto anmelden.
- Nach dem Scannen des QR-Codes wird der entsprechende Song direkt in der WebApp abgespielt ohne jegliche Informationen zum Song preiszugeben.

#### User Story 5: Anpassung des QR-Karten-Designs (Prio 'Could')

Als eingeloggter Benutzer kann ich einfache Anpassungen am Design der QR-Karten vornehmen, um das Erscheinungsbild an meine persönlichen Vorlieben anzupassen.

**Akzeptanzkriterien:**

- Der Benutzer kann Farben, Positionen von Texten und QR-Codes sowie grundlegende Layout-Elemente anpassen.
- Änderungen am Design werden in einer Vorschau angezeigt.
- Die Anpassungen betreffen nur das visuelle Layout und haben keinen Einfluss auf den Inhalt der QR-Codes.

#### User Story 6: Galerie-Ansicht für QR-Karten (Prio 'Could')

Als Benutzer mit Zugriff auf den Songlisten-Link kann ich alle bereits hinzugefügten QR-Karten in einer Galerie-Ansicht anzeigen, um einen Überblick über die hinzugefügten Songs zu erhalten.

**Akzeptanzkriterien:**

- Die Galerie-Ansicht zeigt alle QR-Karten einer Songliste in einer übersichtlichen Darstellung.
- Jede QR-Karte kann in der Galerie vergrössert angezeigt werden.
- Die Galerie wird automatisch aktualisiert, wenn neue Songs hinzugefügt werden.

### Qualitätsanforderungen

- **Benutzerfreundlichkeit:** Die Anwendung soll intuitiv bedienbar sein, sowohl auf Desktop- als auch auf Mobilgeräten.
- **Performance:** Die Ladezeit der Anwendung soll unter 1 Sekunde betragen.
- **Integration:** Die Spotify API muss stabil und zuverlässig eingebunden sein.

### Technologie-Stack

Für die Umsetzung des Projekts **Guestbook Game** wird folgender Technologie-Stack verwendet:

**Frontend: Typescript/Angular**
Das Frontend wird mit Angular entwickelt. Da ich bisher wenig Erfahrung im Web-Development habe, bietet Angular eine ideale Möglichkeit, meine Kenntnisse zu vertiefen. Besonders vorteilhaft ist, dass Angular Teil der aktuellen Blockwoche ist, wodurch ich das im Unterricht Gelernte direkt in der Praxis anwenden kann.

**Backend: Express.js**
Im Backend wird Express.js eingesetzt. Durch die schlanke Architektur erhoffe ich mir einen einfachen Einstieg.

**Datenbank: PostgreSQL**
Als Datenbank wird PostgreSQL verwendet. Aufgrund der eher unkomplizierten Datenstruktur des Projekts eignet sich eine relationale Datenbank besonders gut. PostgreSQL bietet dabei eine hohe Stabilität und Flexibilität für die Verwaltung der Song- und Benutzerdaten. 
Die Datenbank läuft in einem **Dockercontainer** 


