"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OCRDocumento } from "@/components/ocr-documento";

export default function NuevoPacientePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    fechaNacimiento: "",
    genero: "",
    tipoDocumento: "",
    curp: "",
    telefono: "",
    telefonoEmergencia: "",
    nombreContactoEmergencia: "",
    parentescoContacto: "",
    direccion: "",
    estado: "",
    municipio: "",
    codigoPostal: "",
    tipoSangre: "",
    alergias: "",
    antecedentes: "",
    seguroMedico: "",
    numeroSeguro: "",
    notas: "",
  });

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // En producción esto haría un POST a la API
    alert("Paciente registrado correctamente (demo)");
    router.push("/pacientes");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-blue-100 p-2">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registrar Nuevo Paciente</h1>
          <p className="text-sm text-gray-500">Complete los datos del paciente para crear su expediente</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OCR - Llenado rápido con foto de documento */}
        <OCRDocumento
          onDatosExtraidos={(datos) => {
            // Detectar tipo de documento y número
            let tipoDoc = "";
            let numDoc = "";
            if (datos.curp) {
              tipoDoc = "CURP";
              numDoc = datos.curp;
            } else if ((datos as Record<string, string>).numeroDocumento) {
              numDoc = (datos as Record<string, string>).numeroDocumento;
              const tipo = (datos as Record<string, string>).tipoDocumento || "";
              if (tipo.includes("Pasaporte")) tipoDoc = "PASAPORTE";
              else if (tipo.includes("Cédula")) tipoDoc = "CEDULA";
              else if (tipo.includes("DNI")) tipoDoc = "DNI";
              else if (tipo.includes("NIE")) tipoDoc = "NIE";
              else if (tipo.includes("INE")) tipoDoc = "INE";
              else if (tipo.includes("Licencia")) tipoDoc = "LICENCIA";
              else tipoDoc = "OTRO";
            }

            setForm((prev) => ({
              ...prev,
              ...(datos.nombre && { nombre: datos.nombre }),
              ...(datos.apellidoPaterno && { apellidoPaterno: datos.apellidoPaterno }),
              ...(datos.apellidoMaterno && { apellidoMaterno: datos.apellidoMaterno }),
              ...(datos.fechaNacimiento && { fechaNacimiento: datos.fechaNacimiento }),
              ...(datos.genero && { genero: datos.genero }),
              ...(numDoc && { curp: numDoc }),
              ...(tipoDoc && { tipoDocumento: tipoDoc }),
              ...(datos.estado && { estado: datos.estado }),
            }));
          }}
        />

        {/* Datos personales */}
        <Card>
          <CardHeader>
            <CardTitle>Datos Personales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input
                label="Nombre(s)"
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) => updateForm("nombre", e.target.value)}
                required
              />
              <Input
                label="Apellido 1"
                placeholder="Primer apellido"
                value={form.apellidoPaterno}
                onChange={(e) => updateForm("apellidoPaterno", e.target.value)}
                required
              />
              <Input
                label="Apellido 2"
                placeholder="Segundo apellido"
                value={form.apellidoMaterno}
                onChange={(e) => updateForm("apellidoMaterno", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Input
                label="Fecha de Nacimiento"
                type="date"
                value={form.fechaNacimiento}
                onChange={(e) => updateForm("fechaNacimiento", e.target.value)}
                required
              />
              <Select
                label="Género"
                placeholder="Seleccione..."
                options={[
                  { value: "MASCULINO", label: "Masculino" },
                  { value: "FEMENINO", label: "Femenino" },
                  { value: "OTRO", label: "Otro" },
                ]}
                value={form.genero}
                onChange={(e) => updateForm("genero", e.target.value)}
              />
              <Select
                label="Tipo de documento"
                placeholder="Seleccione..."
                options={[
                  { value: "CURP", label: "CURP (México)" },
                  { value: "INE", label: "INE/IFE (México)" },
                  { value: "CEDULA", label: "Cédula de ciudadanía" },
                  { value: "PASAPORTE", label: "Pasaporte" },
                  { value: "DNI", label: "DNI" },
                  { value: "NIE", label: "NIE (España)" },
                  { value: "LICENCIA", label: "Licencia de conducir" },
                  { value: "ACTA_NACIMIENTO", label: "Acta de nacimiento" },
                  { value: "OTRO", label: "Otro documento" },
                ]}
                value={form.tipoDocumento}
                onChange={(e) => updateForm("tipoDocumento", e.target.value)}
              />
              <Input
                label="Número de identificación"
                placeholder="Número del documento"
                value={form.curp}
                onChange={(e) => updateForm("curp", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contacto */}
        <Card>
          <CardHeader>
            <CardTitle>Contacto y Emergencia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Teléfono del tutor"
                type="tel"
                placeholder="55 1234 5678"
                value={form.telefono}
                onChange={(e) => updateForm("telefono", e.target.value)}
              />
              <Input
                label="Teléfono de emergencia"
                type="tel"
                placeholder="55 8765 4321"
                value={form.telefonoEmergencia}
                onChange={(e) => updateForm("telefonoEmergencia", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Nombre del contacto de emergencia"
                placeholder="Nombre completo"
                value={form.nombreContactoEmergencia}
                onChange={(e) => updateForm("nombreContactoEmergencia", e.target.value)}
              />
              <Select
                label="Parentesco"
                placeholder="Seleccione..."
                options={[
                  { value: "madre", label: "Madre" },
                  { value: "padre", label: "Padre" },
                  { value: "tutor", label: "Tutor legal" },
                  { value: "abuelo", label: "Abuelo/a" },
                  { value: "tio", label: "Tío/a" },
                  { value: "otro", label: "Otro" },
                ]}
                value={form.parentescoContacto}
                onChange={(e) => updateForm("parentescoContacto", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dirección */}
        <Card>
          <CardHeader>
            <CardTitle>Dirección</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              label="Dirección completa"
              placeholder="Calle, número, colonia..."
              value={form.direccion}
              onChange={(e) => updateForm("direccion", e.target.value)}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input
                label="Estado"
                placeholder="Estado de México"
                value={form.estado}
                onChange={(e) => updateForm("estado", e.target.value)}
              />
              <Input
                label="Municipio"
                placeholder="Municipio"
                value={form.municipio}
                onChange={(e) => updateForm("municipio", e.target.value)}
              />
              <Input
                label="Código Postal"
                placeholder="00000"
                maxLength={5}
                value={form.codigoPostal}
                onChange={(e) => updateForm("codigoPostal", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Información médica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Médica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Select
                label="Tipo de sangre"
                placeholder="Seleccione..."
                options={[
                  { value: "A+", label: "A+" },
                  { value: "A-", label: "A-" },
                  { value: "B+", label: "B+" },
                  { value: "B-", label: "B-" },
                  { value: "AB+", label: "AB+" },
                  { value: "AB-", label: "AB-" },
                  { value: "O+", label: "O+" },
                  { value: "O-", label: "O-" },
                ]}
                value={form.tipoSangre}
                onChange={(e) => updateForm("tipoSangre", e.target.value)}
              />
              <Input
                label="Seguro médico"
                placeholder="IMSS, ISSSTE, Seguro Popular..."
                value={form.seguroMedico}
                onChange={(e) => updateForm("seguroMedico", e.target.value)}
              />
              <Input
                label="Número de seguro"
                placeholder="Número de afiliación"
                value={form.numeroSeguro}
                onChange={(e) => updateForm("numeroSeguro", e.target.value)}
              />
            </div>
            <Textarea
              label="Alergias conocidas"
              placeholder="Ninguna / Penicilina, Sulfa, etc."
              value={form.alergias}
              onChange={(e) => updateForm("alergias", e.target.value)}
            />
            <Textarea
              label="Antecedentes médicos relevantes"
              placeholder="Cirugías previas, enfermedades crónicas, etc."
              value={form.antecedentes}
              onChange={(e) => updateForm("antecedentes", e.target.value)}
            />
            <Textarea
              label="Notas adicionales"
              placeholder="Cualquier información relevante"
              value={form.notas}
              onChange={(e) => updateForm("notas", e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/pacientes")}>
            Cancelar
          </Button>
          <Button type="submit">
            Registrar Paciente
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
