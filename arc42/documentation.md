# arc42-Dokumentation: Guestbook Game

## 1. Einführung und Ziele

### 1.1 Aufgabenstellung
Das **Guestbook Game** ist eine interaktive Webanwendung, die als modernes digitales Gästebuch für Hochzeiten dient. Gäste können über die Web-App ihre Lieblingssongs hinzufügen, persönliche Nachrichten hinterlassen und die erstellten Songlisten später als QR-Karten für ein Musikratespiel exportieren. Die Anwendung integriert die Spotify API zur Musiksuche und -wiedergabe.

### 1.2 Zielgruppen
- **Hochzeitsgäste**: Fügen Songs mit persönlichen Nachrichten hinzu.
- **Verwalter**: Erstellen und verwalten Gästenbücher.
- **Spielteilnehmer**: Nutzen QR-Codes zur Musikwiedergabe.
- **Administratoren**: Verwalten Benutzerkonten und Anpassungen.

### 1.3 Qualitätsziele
- **Benutzerfreundlichkeit**: Intuitive Nutzung auf Desktop und Mobilgeräten.
- **Performance**: Ladezeit unter 1 Sekunde.
- **Zuverlässigkeit**: Stabile Integration der Spotify API.
- **Sicherheit**: Geschützte Benutzeranmeldung und Datenspeicherung.

### 1.4 Stakeholder
| Rolle             | Interesse                     |
|-------------------|-------------------------------|
| Gästebuchverwalter | Verwaltung der Gästebücher    |
| Gäste             | Hinzufügen von Songs          |
| Entwickler        | Wartung und Weiterentwicklung |
| Hochzeitspaar     | Spielen des Gästebuchspiels   |

---

## 2. Randbedingungen

### 2.1 Technische Randbedingungen
- **Frontend:** Angular (TypeScript)
- **Backend:** Express.js (Node.js, TypeScript)
- **Datenbank:** PostgreSQL in Docker
- **Cloud/Hosting:** Lokale Instanz
- **Schnittstellen:** Spotify API für Song- und Account-Integration

### 2.2 Organisatorische Randbedingungen
- Das Projekt ist Teil der Blockwoche WebLab an der Hochschule Luzern. Erwarteter Zeitaufwand: 60 h.
- Entwicklung erfolgt in Eigenregie mit Fokus auf MVP (Minimal Viable Product).

---

## 3. Kontextabgrenzung

### 3.1 Systemkontext
Das Guestbook Game interagiert mit mehreren externen Systemen:
- **Spotify API** (Suche nach Songs, Authentifizierung, Wiedergabe von Musik)
- **Webbrowser** für die Nutzung der Web-App. 

**Kontextdiagramm:**
![C1.svg](./C1.svg)


---

## 4. Lösungskonzept (Architekturübersicht)
Das System ist in drei Hauptkomponenten unterteilt:

1. **Single-Page Applikation (Angular)**: UI für Benutzerinteraktionen. Greift für das Abspielen von Liedern direkt auf Spotify API zu.
2. **API Applikation (Express.js)**: Verarbeitung von Anfragen und Spotify-API-Anbindung.
3. **Datenbank (PostgreSQL)**: Speicherung der Songs, User und Listen.

![C2.svg](./C2.svg)
---

## 5. Bausteinsicht
Die Software folgt mehr oder weniger einer Schichtenarchitektur:

### **Frontend (Angular)**
Das Frontend ist in Applikation, Features und Services organisiert:
- **Applikation:** Verwaltet Zugriff auf die verschiedenen Features. 
- **Features:** UI-Elemente für die Songlisten, QR-Code-Generierung und Benutzerverwaltung. Übernimmt momentan noch Teil der Kommunikation mit dem Backend.
- **Services:** Kommunikation mit dem Backend über HTTP.

**Single-Page Applikation-Bausteinsicht:**
![C3Frontend.svg](./C3Frontend.svg)


### **API Applikation (Express.js mit TypeScript)**
Die API Applikation ist in verschiedene Verantwortlichkeiten unterteilt:

- **Controller:** Validierung und Verarbeitung eingehender Requests.
- **Service:** Enthält die Geschäftslogik.
- **Client:** Kommunikation mit externen APIs (z. B. Spotify API).
- **Data Service:** Interaktion mit der PostgreSQL-Datenbank.

**API Applikation-Bausteinsicht:**
![C3Backend.svg](./C3Backend.svg)

### **API Datenbank (Postgres)**
Die Datenbank hat folgende Gliederung.
![database.png](./database.png)


---

## 6. Laufzeitsicht
Im folgenden Sequenzdiagram wird ein typischer Ablauf angezeigt, der in der Anwendung vorkommt.

![Sequence.svg](./Sequence.svg)

---

## 7. Verteilungssicht
Das System wird in einer lokalen Instanz betrieben, besteht aber aus mehreren Komponenten:
- **Frontend (Angular)** läuft im Browser des Nutzers.
- **Backend (Express.js)** läuft als Node.js-Server.
- **Datenbank (PostgreSQL)** läuft als Docker-Container.

---

## 8. Querschnittliche Konzepte
- **Authentifizierung:** Benutzerkonten werden mit einem sicheren Hash-Mechanismus gespeichert. 
- **Datenpersistenz:** PostgreSQL speichert Gästebücher und Songs.
- **API-Integration:** Spotify API wird für die Song-Suche und Authentifizierung genutzt, Swagger wird genutzt um die Endpoints des Backends übersichtlich darzustellen.

---

## 9. Architekturentscheidungen
- **Verwendung von Angular für das Frontend**, um eine moderne SPA-Architektur umzusetzen.
- **Einsatz von Express.js im Backend**, um eine leichte API-Anwendung zu realisieren.
- **PostgreSQL als relationale Datenbank**, um eine robuste und flexible Datenspeicherung zu ermöglichen.
- **Einsatz Schichtenarchitektur**, für eine übersichtliche Gliederung und schnelle Fehlerfindung.

---

## 10. Qualitätsanforderungen
- **Hohe Benutzerfreundlichkeit** für eine intuitive Bedienung.
- **Optimierte Performance** für schnelle Ladezeiten.
- **Sichere Speicherung und Authentifizierung** der Benutzerkonten.
- **Stabile API-Integration** mit der Spotify API.

---

## 11. Risiken und technische Schulden
- **Spotify API-Limitierungen:** Begrenzte API-Abfragen pro Stunde.
- **Skalierbarkeit:** Derzeit nur für kleine Nutzergruppen optimiert.
- **Testing nur begrenzt vorhanden:** Eine technische Schuld die in der Zukunft gezahlt werden muss.
- **Schichtenarchitektur im Frontend:** ist nicht immer schön umgesetzt und muss in der Zukunft umstrukturiert werden. 
- **QR Scanner noch nicht vorhanden** muss für die volle Funktionalität noch erstellt werden. 

---

## 12. Glossar
| Begriff | Bedeutung |
|---------|----------|
| SPA | Single Page Application |
| API | Application Programming Interface |
| QR-Code | Schnell scannbarer Code für mobile Geräte |


