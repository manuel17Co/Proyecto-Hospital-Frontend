import { Text, View, StyleSheet } from 'react-native';
import AppButton from '../../../src/components/AppButton';
import { useAuth } from '../../../src/context/AuthContext';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonBox: {
        width: '100%',
        maxWidth: 280,
        marginTop: 20,
    },
});

export default function Perfil() {
    const { logout } = useAuth();

    return (
        <View style={styles.container}>
            <Text>vista para el perfil</Text>
            <View style={styles.buttonBox}>
                <AppButton title="Cerrar sesión" onPress={() => void logout()} />
            </View>
        </View>
    )
}
