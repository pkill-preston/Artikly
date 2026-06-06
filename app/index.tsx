import {Modal, Pressable, Text, View, StyleSheet, TextInput} from "react-native";
import {useEffect, useState} from "react";
import NavigationButton from "@/app/components/NavigationButton";
import {router} from "expo-router";
import {BadgeQuestionMark, BookA, Dices} from "lucide-react-native";
import {useAppStore} from "@/app/store/useAppStore";
import {useDailyStore} from "@/app/store/useDailyStore";

export default function App() {
    const screenWidth = window.screenX
    const [modalOpen, setModalOpen] = useState(false);
    const [amount, setAmount] = useState("1");
    const appStore = useAppStore();

    useEffect(() => {
        setModalOpen(false);
        console.log(useDailyStore.getState())
        appStore.reset();
    },[]);

    return (
        <View style={styles.pageContainer}>
            <NavigationButton
                label="Daily"
                icon={<BookA size={24} color="#2563EB" strokeWidth={1}/>}
                iconBgColor="#EBF3FF"
                onPress={() => router.push("/daily")}
            />
            <NavigationButton
                label="Challenge"
                icon={<BadgeQuestionMark size={24} color="#F59E0B" strokeWidth={1}/>}
                iconBgColor="#FEF3C7"
                onPress={() => setModalOpen(true)}
            />
            <NavigationButton
                label="Random"
                icon={<Dices  size={24} color="#8B5CF6" strokeWidth={1} />}
                iconBgColor="#EDE9FE"
                onPress={() => router.push("/random")}
            />
            <Modal
                animationType="fade"
                transparent={true}
                backdropColor={"#000000"}
                pointerEvents={"auto"}
                visible={modalOpen}
                onRequestClose={() => {
                    setModalOpen(!modalOpen);
                }}>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, {width: screenWidth ? screenWidth * 0.8 : 300}]}>
                        <Pressable onPress={() => setModalOpen(!modalOpen)} style={styles.closeModal}>
                            <Text style={styles.closeCross}>&times;</Text>
                        </Pressable>
                        <Text style={styles.modalText}>Insert how many cards you want to challenge</Text>
                        <Text>Max of 50</Text>
                        <View style={styles.changeAmount}>
                            <Pressable onPress={() => setAmount((prev) => String(Math.max(Number(prev) - 1, 1)))}
                                       style={styles.operator}>-</Pressable>
                            <TextInput style={styles.input}
                                       inputMode={"numeric"}
                                       value={amount}
                                       textAlign={"center"}
                                       placeholder={amount ? amount : "1"}
                                       onChangeText={(text) => {
                                           const numbersOnly = text.replace(/[^0-9]/g, "");

                                           if (Number(numbersOnly) > 50) {
                                               setAmount("50");
                                               return;
                                           }

                                           if (Number(numbersOnly) < 1 || numbersOnly === "") {
                                               setAmount("1");
                                               return;
                                           }

                                           setAmount(numbersOnly);
                                       }}></TextInput>
                            <Pressable onPress={() => setAmount((prev) => String(Math.min(Number(prev) + 1, 50)))}
                                       style={styles.operator}>+</Pressable>
                        </View>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                router.push(`/challenge?amount=${amount}`)
                                setModalOpen(!modalOpen);
                            }}>
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        display: "flex",
        alignItems: "center",
        padding: 8,
        flex: 1,
        gap: 8,
        backgroundColor: "#f5fcff"
    },
    centeredView: {
        position: 'relative',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        flex: 1,
        justifyContent: 'center',
        height: "auto",
        alignItems: 'center',
    },
    closeModal: {
        position: 'absolute',
        top: 8,
        right: 16,
    },
    closeCross: {
        fontSize: 24
    },
    modalView: {
        position: "relative",
        padding: 35,
        display: "flex",
        flexWrap: "wrap",
        height: "auto",
        gap: 8,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        display: "flex",
        gap: 12,
        width: 120,
        height: 160,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
        color: "#2196F3",
    },
    buttonContainer: {
        width: "100%",
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    operator: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        lineHeight: 40,
        width: 40,
        height: 40,
        borderRadius: 1000,
        backgroundColor: "#2196F3",
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        padding: 6,
        margin: 0
    },
    changeAmount: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        width: "100%"
    },
    buttonClose: {
        width: "100%",
        padding: 12,
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});