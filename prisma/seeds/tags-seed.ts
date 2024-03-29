import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const tags = await db.tag.createMany({
    data: [
      { name: "Morning Musume" },
      { name: "Morning Musume '14" },
      { name: "Morning Musume '15" },
      { name: "Morning Musume '16" },
      { name: "Morning Musume '17" },
      { name: "Morning Musume '18" },
      { name: "Morning Musume '19" },
      { name: "Morning Musume '20" },
      { name: "Morning Musume '21" },
      { name: "Morning Musume '22" },
      { name: "Morning Musume '23" },
      { name: "Morning Musume '24" },
      { name: "Nakazawa Yuko" },
      { name: "Ishiguro Aya" },
      { name: "Iida Kaori" },
      { name: "Abe Natsumi" },
      { name: "Fukuda Asuka" },
      { name: "Yasuda Kei" },
      { name: "Yaguchi Mari" },
      { name: "Ichii Sayaka" },
      { name: "Goto Maki" },
      { name: "Ishikawa Rika" },
      { name: "Yoshizawa Hitomi" },
      { name: "Tsuji Nozomi" },
      { name: "Kago Ai" },
      { name: "Takahashi Ai" },
      { name: "Konno Asami" },
      { name: "Ogawa Makoto" },
      { name: "Niigaki Risa" },
      { name: "Fujimoto Miki" },
      { name: "Kamei Eri" },
      { name: "Michishige Sayumi" },
      { name: "Tanaka Reina" },
      { name: "Kusumi Koharu" },
      { name: "Mitsui Aika" },
      { name: "Junjun" },
      { name: "Linlin" },
      { name: "Fukumura Mizuki" },
      { name: "Sayashi Riho" },
      { name: "Suzuki Kanon" },
      { name: "Ikuta Erina" },
      { name: "Iikubo Haruna" },
      { name: "Sato Masaki" },
      { name: "Kudo Haruka" },
      { name: "Ishida Ayumi" },
      { name: "Oda Sakura" },
      { name: "Ogata Haruna" },
      { name: "Nonaka Miki" },
      { name: "Makino Maria" },
      { name: "Haga Akane" },
      { name: "Kaga Kaede" },
      { name: "Yokoyama Reina" },
      { name: "Morito Chisaki" },
      { name: "Kitagawa Rio" },
      { name: "Okamura Homare" },
      { name: "Yamazaki Mei" },
      { name: "Sakurai Rio" },
      { name: "Inoue Haruka" },
      { name: "Yumigeta Ako" },
      { name: "S/mileage" },
      { name: "ANGERME" },
      { name: "Wada Ayaka" },
      { name: "Maeda Yuuka" },
      { name: "Fukuda Kanon" },
      { name: "Ogawa Saki" },
      { name: "Nakanishi Kana" },
      { name: "Takeuchi Akari" },
      { name: "Katsuta Rina" },
      { name: "Tamura Meimi" },
      { name: "Kosuga Fuyuka" },
      { name: "Murota Mizuki" },
      { name: "Aikawa Maho" },
      { name: "Kasahara Momona" },
      { name: "Funaki Musubu" },
      { name: "Oota Haruka" },
      { name: "Kamikokuryo Moe" },
      { name: "Kawamura Ayano" },
      { name: "Sasaki Rikako" },
      { name: "Ise Layla" },
      { name: "Hashisako Rin" },
      { name: "Kawana Rin" },
      { name: "Tamenaga Shion" },
      { name: "Matsumoto Wakana" },
      { name: "Hirayama Yuki" },
      { name: "Shimoitani Yukiho" },
      { name: "Goto Hana" },
      { name: "Juice=Juice" },
      { name: "Uemura Akari" },
      { name: "Dambara Ruru" },
      { name: "Inoue Rei" },
      { name: "Kudo Yume" },
      { name: "Matsunaga Riai" },
      { name: "Arisawa Ichika" },
      { name: "Irie Risa" },
      { name: "Ebata Kisaki" },
      { name: "Ishiyama Sakura" },
      { name: "Endo Akari" },
      { name: "Kawashima Mifu" },
      { name: "Miyazaki Yuka" },
      { name: "Kanazawa Tomoko" },
      { name: "Takagi Sayuki" },
      { name: "Otsuka Aina" },
      { name: "Miyamoto Karin" },
      { name: "Yanagawa Nanami" },
      { name: "Inaba Manaka" },
      { name: "Tsubaki Factory" },
      { name: "Yamagishi Riko" },
      { name: "Ogata Risa" },
      { name: "Kishimoto Yumeno" },
      { name: "Asakura Kiki" },
      { name: "Niinuma Kisora" },
      { name: "Tanimoto Ami" },
      { name: "Ono Mizuho" },
      { name: "Onoda Saori" },
      { name: "Akiyama Mao" },
      { name: "Kasai Yuumi" },
      { name: "Yagi Shiori" },
      { name: "Fukuda Marine" },
      { name: "Yofu Runo" },
      { name: "Ishii Mihane" },
      { name: "Murata Yuu" },
      { name: "Doi Fuka" },
      { name: "Kobushi Factory" },
      { name: "Fujii Rio" },
      { name: "Hirose Ayaka" },
      { name: "Nomura Minami" },
      { name: "Ogawa Rena" },
      { name: "Hamaura Ayano" },
      { name: "Taguchi Natsumi" },
      { name: "Wada Sakurako" },
      { name: "Inoue Rei" },
      { name: "Country Girls" },
      { name: "Tsugunaga Momoko" },
      { name: "Yamaki Risa" },
      { name: "Inaba Manaka" },
      { name: "Morito Chisaki" },
      { name: "Shimamura Uta" },
      { name: "Ozeki Mai" },
      { name: "Yanagawa Nanami" },
      { name: "Funaki Musubu" },
      { name: "BEYOOOOONDS" },
      { name: "Ichioka Reina" },
      { name: "Shimakura Rika" },
      { name: "Nishida Shiori" },
      { name: "Eguchi Saya" },
      { name: "Takase Kurumi" },
      { name: "Maeda Kokoro" },
      { name: "Yamazaki Yuhane" },
      { name: "Okamura Minami" },
      { name: "Kiyono Momohime" },
      { name: "Hirai Miyo" },
      { name: "Kobayashi Honoka" },
      { name: "Satoyoshi Utano" },
      { name: "Berryz Koubou" },
      { name: "Shimizu Saki" },
      { name: "Tsugunaga Momoko" },
      { name: "Tokunaga Chinami" },
      { name: "Sudo Maasa" },
      { name: "Natsuyaki Miyabi" },
      { name: "Kumai Yurina" },
      { name: "Sugaya Risako" },
      { name: "Ishimura Maiha" },
      { name: "C-ute" },
      { name: "Umeda Erika" },
      { name: "Yajima Maimi" },
      { name: "Murakami Megumi" },
      { name: "Nakajima Saki" },
      { name: "Suzuki Airi" },
      { name: "Okai Chisato" },
      { name: "Hagiwara Mai" },
      { name: "Arihara Kanna" },
      { name: "OCHA NORMA" },
      { name: "Saito Madoka" },
      { name: "Hiromoto Ruli" },
      { name: "Ishiguri Kanami" },
      { name: "Yonemura Kirara" },
      { name: "Kubota Nanami" },
      { name: "Tashiro Sumire" },
      { name: "Nakayama Natsume" },
      { name: "Nishizaki Miku" },
      { name: "Kitahara Momo" },
      { name: "Tsutsui Roko" },
      { name: "Hello Pro Kenshuusei" },
      { name: "Hello Pro Kenshuusei Hokkaido" },
      { name: "Matsubara Yulia" },
      { name: "Onoda Karin" },
      { name: "Hashida Honoka" },
      { name: "Murakoshi Ayana" },
      { name: "Uemura Hasumi" },
      { name: "Yoshida Hinoha" },
      { name: "Kamimura Rena" },
      { name: "Kawano Soara" },
      { name: "Makino Toa" },
      { name: "Hayashi Niina" },
      { name: "Shimakawa Hana" },
      { name: "Asano Yurika" },
      { name: "Miyakoshi Chihiro" },
      { name: "Nishimura Itsuki" },
      { name: "Soma Yume" },
      { name: "Otsubo Mano" },
      { name: "Yoshida Hikari" },
      { name: "Sugihara Meisa" },
      { name: "Hattori Rua" },
      { name: "Mano Erina" },
      { name: "Heike Michiyo" },
      { name: "Taiyou to Ciscomoon" },
      { name: "Coconuts Musume" },
      { name: "Country Musume" },
      { name: "Melon Kinenbi" },
      { name: "Maeda Yuki" },
      { name: "Sheki-Dol" },
      { name: "Matsuura Aya" },
      { name: "v-u-den" },
      { name: "HANGRY & ANGRY" },
      { name: "Up Up Girls (Kakko Kari)" },
      { name: "Up Up Girls (2)" },
      { name: "Sengoku Minami" },
      { name: "Furukawa Konatsu" },
      { name: "Mori Saki" },
      { name: "Sato Ayano" },
      { name: "Saho Akari" },
      { name: "Sekine Azusa" },
      { name: "Arai Manami" },
      { name: "Kudo Sumire" },
      { name: "Suzuki Ayu" },
      { name: "Furuya Yurika" },
      { name: "Suzuki Meina" },
      { name: "Koyama Seina" },
      { name: "Aoyagi Yume" },
      { name: "Sumida Haruka" },
      { name: "Takahagi Chinatsu" },
      { name: "Kajishima Aya" },
      { name: "Sasaki Honoka" },
      { name: "Shimazaki Yuria" },
      { name: "Niikura Ami" },
      { name: "Yoshikawa Mayu" },
      { name: "Hashimura Riko" },
      { name: "Nakaoki Rin" },
      { name: "Nakagawa Chihiro" },
      { name: "Morinaga Niina" },
      { name: "LoVendoЯ" },
      { name: "PINK CRES." },
      { name: "Miyazawa Marin" },
      { name: "Uozumi Yuki" },
      { name: "Okada Marina" },
      { name: "Kobayashi Hikaru" },
      { name: "Nihei Yuuka" },
      { name: "Bitter & Sweet" },
      { name: "Tasaki Asahi" },
      { name: "Hasegawa Moemi" },
    ],
    skipDuplicates: true,
  });
}
main()
  .then(async () => {
    await db.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await db.$disconnect();

    process.exit(1);
  });
