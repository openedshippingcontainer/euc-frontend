import React from "react";
import { Link } from "react-router-dom";

import { styled } from "baseui";
import { LabelLarge } from "baseui/typography";
import { BEHAVIOR, Grid } from "baseui/layout-grid";

import { PageTitle } from "../components/PageTitle";
import { LinkAnchor } from "../components/LinkAnchor";
import { ContentWrapper } from "../components/ContentWrapper";

const H1 = styled("h1", ({ $theme }) => ({
  marginBottom: $theme.sizing.scale100
}));

// TODO: Beautify
const RulesAndGuidesPage = () => (
  <ContentWrapper>
    <Grid behavior={BEHAVIOR.fluid}>
      <PageTitle>Opšta pravila ponašanja na sajtu</PageTitle>
      <LabelLarge $style={{ textDecoration: "underline" }}>
        Kršenjem ovih pravila rizikujete warn i privremeni ili trajni ban!
      </LabelLarge>
      <ul>
        <li>Ne ulazite u rasprave sa Staff-om, ne komentarišite na nekulturan i svađalački način njihove odluke, i ni u kom slučaju nemojte vređati članove Staff-a! Sve zamerke i primedbe o radu Staff-a uputiti na PM jednom od Administratora.</li>
        <li>Ne izazivajte svađu sa drugim korisnicima, bilo na Forumu, na komentarima, ili na Shoutbox-u. Važi i za Staff. Zabranjeno je neprijateljsko i agresivno ponašanje, uvredljive ili rasističke poruke bilo gde na sajtu. Prekršioci ovog pravila biće trajno banovani!</li>
        <li>Neprikladno ponašanje rezultuje upozorenjem (!).</li>
        <li>Dobićete samo jedno upozorenje! Nakon toga sledi ban sa sajta!</li>
        <li>Ukoliko primetite da neko krši pravila sajta, molimo vas da obavestite nekog iz Staff-a.</li>
        <li>Administratori sajta, kao ni ceo Staff, ne snose odgovornost za aktivnosti korisnika na sajtu.</li>
        <li>Bilo kakvo varanje Tracker-a je siguran ban sa sajta!</li>
        <li>Minimalni ratio je 0.2. Ako vam ratio padne ispod 0.25 dobićete sistemski warn kako biste ga popravili na vreme. U slučaju da vam ratio padne ispod 0.2 sledi automatska zabrana skidanja torrenata sa sajta, a ukoliko ga ne popravite za nedelju dana, bićete banovani!</li>
        <li>Održavajte ratio na dobrom nivou, i tako pomozite razvoju zajednice!</li>
        <li>Nemojte misliti da ćete moći da otvorite više naloga kada vam ratio padne ispod zahtevanog, i na taj način izbegavate politiku sajta. Za takve slučajeve ukidamo nove naloge, a ako je korisnik drzak, dobiće zabranu pristupa sajtu na osnovu IP-a!</li>
        <li>Svi warn-ovi (dodeljeni automatski od strane Tracker-a za mali ratio ili od Staff-a) ističu posle određenog vremena i zato nemojte da tražite da vam se manuelno skidaju, što pak ne znači da vam warn kasnije neće biti ponovo dodeljen, shodno potrebi.</li>
      </ul>
      <H1>Pravila postavljanja torenata na sajt</H1>
      <LabelLarge $style={{ textDecoration: "underline" }}>
        Kršenjem ovih pravila će vam torent biti obrisan, a možete dobiti i warn ili ban!
      </LabelLarge>
      <ul>
        <li>
          Opisi torrenata više nisu obavezni i zavise isključivo od uploader-a.
          Sva pitanja i primedbe u vezi sa opisom uputite direktno uploader-u na PM.
          Javno zahtevanje informacija, bilo na komentarima, bilo na forumu,
          nije dozvoljeno i biće kažnjeno warn-om i/ili ban-om!
        </li>
        <li>
          XXX torenti nisu vidljivi na spisku sve dok ne aktivirate odgovarajuću opciju na vašoj profil strani.
          Zabranjeno je kačiti gay i sick porn, što uključuje, ali nije ograničeno na teens, pre-teens, piss, scat, animal i sl. filmove.
          Ako ste u nedoumici, uvek prvo <Link to="/support" component={LinkAnchor}>kontaktirajte Staff!</Link>
        </li>
        <li>Turbo pop i folk torenti nisu vidljivi na spisku sve dok ne aktivirate odgovarajuću opciju na vašoj profil strani.</li>
        <li>
          Strogo je zabranjen upload materijala koji grafički eksplicitno
          prikazuje stvarno nasilje, kao što su snimci ubistava, samoubistava, mentalne
          i/ili fizičke torture i zlostavljanja, silovanja i sl.
          Svako nepridržavanje ovog pravila povlači sa sobom trajni ban sa sajta!
        </li>
        <li>Svi fajlovi moraju biti u originalnom formatu, nemojte namerno menjati ekstenziju.</li>
        <li>
          Duplikati torrenata nisu dozvoljeni, i biće obrisani!
          Pre postavljanja torenta obavezno prvo pretražite da li taj torent već postoji na sajtu,
          pri čemu obavezno check-irajte opciju including dead torents.
          Ako postoji i mrtav je, reseed-ujte ga (tj. priključite se u seed-ere).
          Ovo pravilo ne važi ukoliko je torent koji postavljate boljeg kvaliteta od postojećeg
          (npr. muzika većeg bitrate-a, bolji kvalitet filma, i sl...)
        </li>
        <li>Nemojte praviti miks svega i svačega u torentu, kao npr. sopstvene kompilacije pesama, jer će torent sigurno biti obrisan, a Vi ćete dobiti upozorenje!</li>
        <li>Seed-ujte vaše torente minimum 24h, odnosno do ratio-a 1.0 ili barem dok neko ne skine torent u celosti, a započeo je skidanje.</li>
      </ul>
      <H1>Pravila preuzimanja torenata sa sajta</H1>
      <LabelLarge $style={{ textDecoration: "underline" }}>
        Nepoštovanjem ovih pravila gubite download mogućnosti i rizikujete dobijanje warn-a!
      </LabelLarge>
      <ul>
        <li>Nastavite sa seed-ovanjem skinutog torenta barem do ratio-a 1.0, i na taj način održavajte ukupan ratio i doprinosite celokupnoj zajednici!</li>
        <li>Bilo koji ratio ispod 0.25 znači da ćete biti upozoreni da ga popravite. Ukoliko vam ratio padne ispod 0.2, a ne popravite ga u roku od nedelju dana, sledi ban sa sajta!</li>
        <li>Da biste popravili ratio, koristite seed bonuse! Više informacija možete pronaći ovde.</li>
      </ul>
      <H1>Forum pravila</H1>
      <LabelLarge $style={{ textDecoration: "underline" }}>
        Poštujte ova pravila inače ćete dobiti upozorenje, ili će vam biti uskraćena mogućnost daljeg postovanja!
      </LabelLarge>
      <ul>
        <li>Bez agresivnog ponašanja i flejmovanja!</li>
        <li>Ne uništavajte tuđe teme (npr. spam).</li>
        <li>Nemojte na negativan način komentarisati torente koje neko drugi postavlja, naročito ako ne skidate taj torent, uz izuzetak komentara da je u pitanju lošiji kvalitet od navedenog, da je materijal nuked, i slične zamerke tehničke prirode.</li>
        <li>Nemojte javno tražiti informacije u vezi sa torentom ukoliko se ne nalaze u opisu (da li ima titl, koja je rezolucija/bitrate i sl.). Sva pitanja i primedbe u vezi sa opisom uputite direktno uploader-u na PM.</li>
        <li>Ne zahtevajte i ne postujte seriale, CD keys, password-e ili crack-ove na forumu.</li>
        <li>Ne zahtevajte i ne nudite pozivnice za druge tracker-e na forumu.</li>
        <li>Ne post-ujte 2x, već uvek edit-ujte svoj post ako je poslednji u nizu.</li>
        <li>Na postavljena pitanja odgovarajte precizno i na mestima predviđenim za to!</li>
        <li>Obavezno pročitajte FAQ pre postavljanja pitanja!</li>
      </ul>
    </Grid>
  </ContentWrapper>
);

export default RulesAndGuidesPage;