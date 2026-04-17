import React from 'react';
import { Settings as SettingsIcon, User, Bell, Lock, Palette } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-2">Gérez les paramètres de votre application</p>
      </div>
      
      {/* Sections de paramètres */}
      <div className="space-y-6">
        {/* Profil */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <User className="text-primary-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Profil</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Nom complet</label>
              <input type="text" className="input" defaultValue="Nganty" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" defaultValue="ngantybikele@gmail.com" />
            </div>
            <div>
              <label className="label">Rôle</label>
              <input type="text" className="input" defaultValue="Administrateur" disabled />
            </div>
            <button className="btn btn-primary">Sauvegarder</button>
          </div>
        </div>
        
        {/* Notifications */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="text-yellow-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" defaultChecked />
              <div>
                <div className="font-medium text-gray-900">Notifications par email</div>
                <div className="text-sm text-gray-600">
                  Recevoir des notifications par email pour les mises à jour
                </div>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" defaultChecked />
              <div>
                <div className="font-medium text-gray-900">Notifications de tâches</div>
                <div className="text-sm text-gray-600">
                  Être notifié quand une tâche vous est assignée
                </div>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" />
              <div>
                <div className="font-medium text-gray-900">Rappels de dates limites</div>
                <div className="text-sm text-gray-600">
                  Recevoir des rappels pour les échéances approchantes
                </div>
              </div>
            </label>
          </div>
        </div>
        
        {/* Sécurité */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="text-red-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Sécurité</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Mot de passe actuel</label>
              <input type="password" className="input" placeholder="••••••••" />
            </div>
            <div>
              <label className="label">Nouveau mot de passe</label>
              <input type="password" className="input" placeholder="••••••••" />
            </div>
            <div>
              <label className="label">Confirmer le mot de passe</label>
              <input type="password" className="input" placeholder="••••••••" />
            </div>
            <button className="btn btn-primary">Changer le mot de passe</button>
          </div>
        </div>
        
        {/* Apparence */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="text-purple-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Apparence</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Thème</label>
              <select className="input">
                <option>Clair</option>
                <option>Sombre</option>
                <option>Automatique</option>
              </select>
            </div>
            <div>
              <label className="label">Langue</label>
              <select className="input">
                <option>Français</option>
                <option>English</option>
                <option>Español</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
