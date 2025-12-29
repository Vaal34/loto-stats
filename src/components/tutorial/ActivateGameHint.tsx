import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListChecks, ArrowRight, Info } from 'lucide-react';

interface ActivateGameHintProps {
  onNavigateToParties: () => void;
}

export default function ActivateGameHint({ onNavigateToParties }: ActivateGameHintProps) {
  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <Info className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">
                Comment voir les statistiques d'une partie ?
              </h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  Pour afficher les statistiques d'une partie (y compris la démo), vous devez d'abord l'activer :
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Allez dans l'onglet <strong>"Parties"</strong></li>
                  <li>Trouvez la partie que vous souhaitez analyser</li>
                  <li>Cliquez sur le bouton <strong>"Continuer"</strong></li>
                  <li>Revenez dans l'onglet <strong>"Stats"</strong> pour voir les analyses</li>
                </ol>
                <p className="pt-2 text-xs italic">
                  💡 Astuce : Si vous avez chargé la partie démo depuis Paramètres, n'oubliez pas de l'activer ici pour voir ses statistiques !
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
            <Button
              onClick={onNavigateToParties}
              className="gap-2 flex-1 sm:flex-initial"
            >
              <ListChecks className="h-4 w-4" />
              Aller à la liste des parties
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
