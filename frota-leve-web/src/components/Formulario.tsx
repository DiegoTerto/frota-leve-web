"use client";

import React, { Dispatch, SetStateAction, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Employee } from '@/types/types';
import { AuthContext } from '@/contexts/AuthContext';
import { createEmployee } from '@/services/employee';

const formSchema = z.object({
  email: z.string().email({
    message: "Email inválido",
  }),
  document: z.string().max(10, {
    message: "Documento inválido"
  }),
  name: z.string().max(50, { 
    message: "Nome muito longo"
  }),
  role: z.enum(['Motorista', 'Secretário', 'Diretor'], {
    message: "Cargo inválido"
  })
});



type FormValues = z.infer<typeof formSchema>;

const Formulario = ({onSubmit, setState}:{onSubmit: (User: Employee) => void, setState: Dispatch<SetStateAction<boolean>>}) => {
  const [isEditMode, setIsEditMode] = useState(false); 
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      document: '',
      name: '',
      role: 'Motorista',
    },
  });
  
  const { user } = useContext(AuthContext);

  const handleSubimitLogin = async (data: FormValues) => {
    await createEmployee(user.businessId, {
      email: data.email,
      document: data.document,
      name: data.name,
    });
  }


  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <Card className='w-full max-w-md relative'>
        {/* Botão de Fechar */}
        <button
          onClick={() => setState(false)}
          className='absolute top-2 right-2 text-white text-2xl font-bold'
        >
          &times;
        </button>

        <CardHeader className='bg-[#FFC314]'>
          <CardTitle>{isEditMode ? "Editar Funcionário" : "Adicionar Novo Funcionário"}</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(handleSubimitLogin)}>
              <FormField 
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <input placeholder="Digite o nome" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField 
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documento</FormLabel>
                    <FormControl>
                      <input placeholder="Digite o documento" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField 
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <input type="email" placeholder="Digite o e-mail" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField 
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <FormControl>
                      <select {...field} className='bg-white border rounded p-2'>
                        <option value="Motorista">Motorista</option>
                        <option value="Secretário">Secretário</option>
                        <option value="Diretor">Diretor</option>
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex space-x-2">
                <button className="w-full bg-[#FFC314] text-center flex items-center justify-center p-2 rounded" type="submit">
                  {isEditMode ? "Salvar Alterações" : "Adicionar"}
                </button>
                <button
                  type="button"
                  onClick={() => setState(false)}
                  className="w-full bg-gray-500 text-center flex items-center justify-center p-2 rounded text-white"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </Form>
        </CardContent>
      
      </Card>
    </div>
  );
};

export default Formulario;

