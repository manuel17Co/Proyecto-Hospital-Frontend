import { Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default function Instalaciones() {
    return (
        <View style={styles.container}>
            <Text>vista para las instalaciones</Text>
        </View>
    )
}
