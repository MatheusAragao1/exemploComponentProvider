import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DataContextProvider, useAPI } from './context'

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Página inicial exemplo Navio Escola</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Questions')}><Text>Iniciar avaliação</Text></TouchableOpacity>
    </View>
  );
}

function QuestionsScreen({ navigation }) {
  const { data } = useAPI();

  const [usable, setUsable] = useState(data)

  const [layer, setLayer] = useState(0)

  const [lastQuestionCod, setLastQuestionCod] = useState(0)

  const changeComponent = (cod) => {
    setLayer(layer + 1)
    if(layer == 0){
      setUsable({...usable, processos: data.processos.filter(processo => processo.localCod == cod)})
    }
    else if(layer == 1){
      setUsable({...usable, topicos: data.topicos.filter(topico => topico.processoCod == cod)})      
    }
    else if(layer == 2){
      setUsable({...usable, subTopicos: data.subTopicos.filter(subTopico => subTopico.topicoCod == cod)})      
    }
    else if(layer == 3){
      setUsable({...usable, perguntas: data.perguntas.filter(pergunta => pergunta.subTopicoCod == cod)})      
    }else{
      setLastQuestionCod(cod)
    }
  }

  const handleGoBack = () => {
    setLayer(layer - 1)
  }

  return (
    <>
     {layer > 0 ? <Button style onPress={handleGoBack} title="Voltar"/> : <></>}
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>

      {
      layer == 0 ?
      (usable.locais).map((local, index) => {
        return <TouchableOpacity style={{margin: 10}} onPress={() => changeComponent(local.localCod)} key={index}><Text>{local.local}</Text></TouchableOpacity>
      }) :
      layer == 1 ?
      (usable.processos).map((processo, index) => {
        return <TouchableOpacity style={{margin: 10}} onPress={() => changeComponent(processo.processoCod)} key={index}><Text>{processo.processo}</Text></TouchableOpacity>
      }) :
      layer == 2 ?
      (usable.topicos).map((topico, index) => {
        return <TouchableOpacity style={{margin: 10}} onPress={() => changeComponent(topico.topicoCod)} key={index}><Text>{topico.topico}</Text></TouchableOpacity>
      }) :
      layer == 3 ?
      (usable.subTopicos).map((subTopico, index) => {
        return <TouchableOpacity style={{margin: 10}} onPress={() => changeComponent(subTopico.subTopicoCod)} key={index}><Text>{subTopico.subTopico}</Text></TouchableOpacity>
      }) :
      layer == 4 ?
      (usable.perguntas).map((pergunta, index) => {
        return <TouchableOpacity style={{margin: 10}} onPress={() => changeComponent(pergunta.perguntaCod)} key={index}><Text>{pergunta.pergunta}</Text></TouchableOpacity>
      }) :
      layer == 5 ? 
        <Text>{usable.perguntas.filter(pergunta => pergunta.perguntaCod == lastQuestionCod)[0].pergunta} e gerar o formulario para essa pergunta</Text>
      :
        <></>
      }

    </View>
    </>
  )
}

const Stack = createStackNavigator();

function App() {
  return (
   <DataContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Questions" component={QuestionsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
   </DataContextProvider>
  );
}

export default App;