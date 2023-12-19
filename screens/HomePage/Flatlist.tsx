// ...

import React, { useState } from 'react';
import { View, FlatList, Image, StyleSheet, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { adaptViewConfig } from 'react-native-reanimated/lib/typescript/ConfigHelper';

const AfisListesi = () => {
  const [afis, setAfis] = useState([
    "https://static.boxofficeturkiye.com/movie//poster/full/80/2016680-64097616.jpg",
    "https://static.boxofficeturkiye.com/movie//poster/full/47/2016747-64096447.png",
    "https://static.boxofficeturkiye.com/movie//poster/full/77/2015977-64095615.jpg",
    "https://static.boxofficeturkiye.com/movie//poster/full/5/2015705-52458502.png",
    "https://static.boxofficeturkiye.com/movie//poster/full/68/2015768-52329591.jpg",
    "https://static.boxofficeturkiye.com/movie//poster/full/32/2013532-52266857.jpg",
    "https://static.boxofficeturkiye.com/movie//poster/full/69/2015169-52214702.jpg"
  ]);


  const afisGenislik = 300; // Afiş genişliği
  const [aktifIndex, setAktifIndex] = useState(0);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.floor(contentOffset / afisGenislik);

    if (newIndex !== aktifIndex) {
      setAktifIndex(newIndex);
    }
  };

  return (
    <View style={styles.flatlist}>
        <FlatList
        data={afis}
        renderItem={({ item }) => (
            <Image
            source={{ uri: item }}
            style={styles.afisImage}
            />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={afisGenislik}
        decelerationRate="normal"
        onMomentumScrollEnd={handleScrollEnd}
        initialScrollIndex={aktifIndex}
        initialNumToRender={afis.length}
        />
    </View>

  );
};

const styles = StyleSheet.create({
flatlist:{
    padding:0,
},
afisImage: {
    height: 400,
    width: 300,
    resizeMode: 'stretch',
    marginHorizontal: 10,
  },
});

export default AfisListesi;
