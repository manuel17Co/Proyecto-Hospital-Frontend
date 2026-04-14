import { Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default function Medicos() {
    return (
        <View style={styles.container}>
            <Text>vista para los médicos</Text>
        </View>
    )
}
